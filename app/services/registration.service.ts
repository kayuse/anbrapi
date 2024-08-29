import { inject } from "@adonisjs/core";
import Registration from "#models/registration";
import mail from '@adonisjs/mail/services/main'
import { RegistrationConfirmation, RegistrationDocument, RegistrationResponse } from "../requests/registration.js";
import { ApiResponse } from "../requests/api_response.js";
import BibleStudyGroup from "#models/bible_study_group";
import env from '#start/env'
import axios from 'axios';
import { parse } from 'csv-parse/sync';

import { Encryption } from '@adonisjs/core/encryption'
import Hostel from "#models/hostel";
import Floor from "#models/floor";
import Room from "#models/room";
import RegDocRecord from "#models/reg_doc_record";


@inject()
export default class RegistrationService {
    // const errors = []
    protected encryption: Encryption
    protected apiToken: string;
    protected smsApiUrl: string
    constructor() {
        this.encryption = new Encryption({
            secret: env.get('APP_KEY')
        })
        this.smsApiUrl = env.get('SMS_API')
        this.apiToken = this.encryption.decrypt(env.get('API_TOKEN')) as string
    }
    async getRegistration(regID: string): Promise<Registration | null> {
        const registration = await Registration.findBy('registration_id', regID)
        return registration
    }
    async confirm(regID: string): Promise<Registration | null> {
        const registration = await this.getRegistration(regID)
        if (registration) {
            registration.confirmed = true
            registration.save()
        }
        return registration
    }
    async confirmWithUrl(request: RegistrationConfirmation): Promise<RegistrationResponse | null> {
        const registration = await this.getRegistration(request.regId)
        const bibleStudyGroupNumber = this.getRandomInt(1, 20)
        const workshopGroupNumber = this.getRandomInt(1, 20)
        let room_number = 0
        if (registration == null) {
            return null;
        }
        if (request.hasAccomodation == "false") {
            room_number = await this.generateRoomNumber(registration);
        }

        if (registration?.confirmed == false || registration.room_number <= 0) {
            if (registration.age_group != 'Below 18') {
                registration.bible_study_group_name = request.bibleStudyId
                registration.ministry_workshop_group_name = request.ministryWorkshopId
                registration.room_number = room_number
            }

            registration.bible_study_group_number = bibleStudyGroupNumber;
            registration.ministry_workshop_group_number = workshopGroupNumber;

            registration.confirmed = true
            registration.save()
        }
        if (registration != null) {
            const response: RegistrationResponse = {
                registration: registration,
                room: await this.getRoomName(registration)
            }
            return response
        }
        return null
    }
    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async getRoomName(registration : Registration) {
        if(registration.age_group == "Below 18"){
            return "Kindly get your Room from the Registration Desk"
        }
        if (registration.room_number <= 0) {
            return "";
        }
        const room = await Room.findOrFail(registration.room_number)
        const floor = await Floor.findOrFail(room.floor_id)
        const hostel = await Hostel.findOrFail(floor.hostel_id)
        return `${hostel.name}, ${floor.name} - ${room.name}`
    }
    async fetchUrlContent(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching URL content: ${error}`);
        }
    }
    parseCSVData(csvData: string) {
        const records = parse(csvData, {
            columns: true, // Converts each row into an object using the headers
            skip_empty_lines: true
        });
        return records;
    }

    async sync() {
        const url = 'https://docs.google.com/spreadsheets/d/1Porbv6LI0ul4iFS5FTlAA5DUTMQU4_7U6LbLMjqfGIE/export?format=csv'
        const content = await this.fetchUrlContent(url);
        const records = this.parseCSVData(content)
        const record = await RegDocRecord.findOrFail(1);
        const lastRecordId = record.lastRecordId
        let holdingRecord = lastRecordId;
        for (let i = 0; i < records.length; i++) {
            if (i < lastRecordId) {
                continue
            }
            const registration = await Registration.create({
                firstname: records[i]['Full name'],
                email: records[i]['Email Address'],
                mobile: records[i]['Phone Number(Whatsapp preferably)'],
                address: records[i]['Residential address (with street name, landmark and nearest bus stop)'],
                occupation: records[i]['Occupation'],
                marital_status: records[i]['Marital Status'],
                country: records[i]['State and Country of residence'],
                has_attended: records[i]['Have you attended a previous edition of ANBR'],
                your_description: records[i]['How did you hear about this retreat?'],
                needs_attention: records[i]['Is there a need for a special of comfort for you at the retreat (e.g allergies, health issues,  Pregnant/nursing mothers, disability?'],
                nursing_mum: records[i]['Are you a toddler mom? If yes,  how many toddler are you coming with?'],
                expectations: records[i]['What are your expectations from this year\'s Retreat?'].substring(0, 200),
                gender: records[i]['Gender'].toLowerCase(),
                biblestudy_id: records[i]['Age Group'],
            })
            registration.registration_id = `THREG${registration.id}`
            registration.save()
            await this.sendMessage(registration)
            holdingRecord = i;
            //break;
        }
        record.lastRecordId = holdingRecord
        record.save()
        //content.
    }
    async generateRoomNumber(registration: Registration | null): Promise<number> {
        if (registration == null) {
            return -1;
        }
        if (registration.age_group == 'Below 18') {
            return -1;
        }
        let room_number = null;
        const rooms = await Room.query().whereHas('floor', (query) => {
            return query.whereHas('hostel', (anotherQuery) => {
                return anotherQuery.where('gender', registration.gender)
            })
        })
        rooms.forEach(room => {
            if (room.total > room.assigned) {
                room_number = room.id
            }
        })
        if (room_number == null) {
            return -1;
        }
        const room = await Room.find(room_number)
        if (room == null) {
            return -1;
        }
        const assigned = room?.assigned == null ? 0 : room.assigned;
        room.assigned = assigned + 1
        room.save()
        return room_number;
    }
    async sendMessage(registration: Registration) {
        try {
            const res = await mail.send((message) => {
                message.to(registration.email)
                    .from('anbr@threshinghouse.org')
                    .subject('ANBR 2024, Registration')
                    .htmlView('emails/confirm_registration', registration)
            })
            console.log(res)
            let postData = {
                from: "ThresHOUSE",
                to: registration.mobile,
                body: `Your ANBR Registration is Successful, 
                your Registration ID ${registration.registration_id}`,
                api_token: this.apiToken
            }
            const a = await axios.post(this.smsApiUrl, postData);
        } catch (e) {
            console.log(e)

            // console.log(res)
        }
    }
    async process(data: RegistrationDocument): Promise<ApiResponse> {
        const registrations = await Registration.findManyBy({ email: data.email, mobile: data.mobile })
        if (registrations.length > 0) {
            return {
                data: null,
                status: 400,
                message: 'This user already exists'
            }
        }
        const bibleStudyGroup = await BibleStudyGroup.query().orderBy('attendant', 'asc').first()
        const registration = await Registration.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            occupation: data.occupation,
            marital_status: data.marital_status,
            country: data.country,
            has_attended: data.has_attended,
            your_description: data.your_description,
            needs_attention: data.needs_attention,
            nursing_mum: data.nursing_mum,
            expectations: data.expectations,
            invited_by: data.invited_by,
            biblestudy_id: bibleStudyGroup?.study_id,
        })

        registration.registration_id = `THREG${registration.id}`
        registration.save()
        if (bibleStudyGroup != null) {
            bibleStudyGroup.attendant = bibleStudyGroup.attendant += 1
            bibleStudyGroup.save()
        }
        try {
            const res = await mail.send((message) => {
                message.to(registration.email)
                    .from('anbr@threshinghouse.org')
                    .subject('ANBR 2024, Registration')
                    .htmlView('emails/confirm_registration', registration)
            })
            console.log(res)
        } catch (e) {
            console.log(e)
            let postData = {
                from: "ThresHOUSE",
                to: registration.mobile,
                body: `Your ANBR Registration is Successful, 
                your Registration ID ${registration.registration_id} 
                and BibleStudy Group ${registration.biblestudy_id}`,
                api_token: this.apiToken
            }
            const res = await axios.post(this.smsApiUrl, postData);
            console.log(res)
        }

        const response: ApiResponse = {
            status: 200,
            data: registration,
            message: "Successful"
        }
        return response
    }
}