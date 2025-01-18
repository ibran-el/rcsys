import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if(req.method !== 'POST'){
        return res.status(405).json({msg: 'Method not allowed'});
    }

    const {studentID} = req.body;

    if(!studentID){
        return res.status(400).json({msg: 'Required studentID'});
    }

    try{
        const client = await clientPromise;
        const db = client.db('rollcallsysdb');

        console.log('Connected to MongoDB:', !!client);

        //check if student exists
        const student = await db.collection('students').findOne({student_id: studentID})
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
        const message = `Internal server error for ID: ${studentID}`;
        res.status(500).json({msg: message, error: error.msg});
    }
}