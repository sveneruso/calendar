import React, {useContext, useEffect, useState} from 'react';
import {mentorContext} from '../../context/mentorContext';
import {ICalendar, IMentorCalendar} from '../../Interface';
import {DateTime} from 'luxon';
import {Button, Form} from 'react-bootstrap';
import './Calendar.css'

interface IProp {
    years: number[]
}

function Calendar(props: IProp) {

    const [appointments, setAppointments] = useState<IMentorCalendar | null>(null);
    const [blockedSlot, setBlockedSlot] = useState<DateTime[]>([]);
    const [availableSlot, setAvailableSlot] = useState<DateTime[]>([]);
    const [year, setYear] = useState<number>(0);
    const [month, setMonth] = useState<number>( 0);
    const [day, setDay] = useState<number>(0);

    const [days, setDays] = useState<number[]>([]);

    let mentor = useContext(mentorContext);

    const selectYear = (e: any) => {
        setYear(e.target.value);
        setMonth(0);
        setDay(0);
    }

    const selectMonth = (e: any) => {
        setMonth(e.target.value);
        if (e.target.value > 0) {
            let date = DateTime.local(parseInt(String(year)), parseInt(String(e.target.value)));

            let days: number[] = [];
            for(let count = 1; count < date.daysInMonth; count++) {
                days.push(count);
            }
            setDays(days);
        } else {
            setDay(0);
            setDays([])
        }
    }

    const selectDay = (e: any) => {
        setDay(e.target.value);
    }

    useEffect(() => {
        if (mentor !== null) {
            fetch(`https://private-anon-f4858c74cf-cfcalendar.apiary-mock.com/mentors/${mentor}/agenda`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setAppointments(result);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        } else {
            setAppointments(null);
        }

    }, [mentor]);

    useEffect( () => {
        if(appointments?.calendar && appointments?.calendar?.length > 0) {
            setBlockedSlot(convertTimeZone(appointments?.calendar , appointments.mentor.time_zone));
        }
    }, [appointments?.calendar, appointments?.mentor.time_zone])

    useEffect(() => {
        const slots = [];
        if(day !== 0) {
            let strDay = day < 10 ? `0${day}` : `${day}`;
            let strMonth = month < 10 ? `0${month}` : `${month}`;
            let dateStart = `${year}-${strMonth}-${strDay}T00:00:00${appointments?.mentor.time_zone}`
            let current = DateTime.fromISO(dateStart, {setZone: true});

            while ( current.get('day') !== day) {
                let isBooked = false;
                blockedSlot.forEach( b => isBooked = isBooked || b.equals(current))
                if(!isBooked) {
                    slots.push(current);
                }
                current = current.plus({'hours': 1})
            }

            setAvailableSlot(slots);
        }

    }, [day, month, year, appointments?.mentor.time_zone, blockedSlot]);

    const convertTimeZone = (calendar: ICalendar[], timezone: string) => {
        let blocked: DateTime[] = []
        calendar.forEach( a => {
            let strDate: string[] = a.date_time.split(' ');
            let hour = strDate[1].split(':');
            let slot = `${strDate[0]}T${hour[0]}:00:00${timezone}`
            blocked.push(DateTime.fromISO(slot, {setZone: true}))
        })

        return blocked
    }

    return <>
        <div className="date-picker">
            <h3> Select a date: </h3>
            <Form.Select onChange={selectYear} disabled={appointments === null}>
                <option>Year</option>
                { props.years.map( y =>
                    <option key={y} value={y}>{y}</option>)
                }
            </Form.Select>

            <Form.Select onChange={selectMonth} disabled={year === 0}>
                <option>Month</option>
                { [1,2,3,4,5,6,7,8,9,10,11,12].map( m =>
                    <option key={m} value={m}>{m}</option>)
                }
            </Form.Select>

            <Form.Select onChange={selectDay} disabled={month === 0}>
                <option>Day</option>
                { days.map( d =>
                    <option key={d} value={d}>{d}</option>)
                }
            </Form.Select>
        </div>


        <div className="calendar">
            { availableSlot.map( c => (
                <div key={c.toJSDate().toString()} className="available-slot">
                    <p className="time">{c.toFormat('yyyy-MM-dd HH:mm')}</p>
                    <Button> Book </Button>
                </div>
            )) }
        </div>


    </>;
}

export default Calendar;
