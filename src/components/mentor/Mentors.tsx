import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import {mentorContext} from '../../context/mentorContext';
import Calendar from '../calendar/Calendar';
import {IMentorData} from '../../Interface';


function Mentors() {

    const [mentors, setMentors] = useState<IMentorData[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

    const selectMentor = (e: any) => {
        let mentorId = e.target.value;
        if(isNaN(mentorId)) {
            setSelectedMentor(null);
        } else {
            setSelectedMentor(mentorId);
        }

    }

    useEffect(() => {
        fetch('/json/mentor.json')
            .then(res => res.json())
            .then(
                (result) => {
                    setMentors(result.mentors);
                },
                (error) => {
                    console.error(error);
                }
            );
    }, []);

    return (
        <mentorContext.Provider value={selectedMentor}>
            <Form.Select onChange={selectMentor}>
                <option> Select a mentor</option>
                {mentors.map(m => {
                    return <option key={m.id} value={m.id}>{m.name}</option>;
                })}

            </Form.Select>

            <Calendar years={[2020, 2021]}></Calendar>
        </mentorContext.Provider>

    );
}

export default Mentors;
