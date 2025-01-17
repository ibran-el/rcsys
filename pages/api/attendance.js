import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    return res.status(405).json({msg: 'Method not allowed'});
}

const {studentID} = req.body;

if(!studentID){
    return res.status(400).json({msg: 'Required studentID'});
}

try{
    const client = await clientPromise;
    const db = client.db('rollcallsysdb');

    //check if student exists
    const student = await db.collection('students').findOne({id: studentID})
    if(!student){
        return res.status(400).json({msg: 'Student not found'});
    }

    //record attendance
    const result = await db.collection('attendance').insertOne({
        student_id: studentID,
        date_time: new Date()
    });

    res.status(201).json({msg: 'Attendance recorded', result}); 
}
catch(error){
    res.status(500).json({msg: 'Internal server error', error: error.msg});
}