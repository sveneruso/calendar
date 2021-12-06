export interface ICalendar {
    date_time: string;
}

export interface IMentor {
    name: string;
    time_zone: string;
}

export interface IMentorCalendar {
    mentor: IMentor;
    calendar: ICalendar[];
}

export interface IMentorData {
    name: string;
    id: string;
}
