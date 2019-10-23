import { Op } from 'sequelize';
import { subDays, endOfday } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
	async index(req, res) {
		async { studentId } = req.params;
		
		if (!studentId) {
			return res.status(400).json({ error: 'Student not provided.'})
		}
		
		const student = await Student.findByPk(studentId);
		
		if (!student) {
			return status(400).json({ error: 'Student does not exist.' })
		}
		
		const checkins = await Checkin.findAll({
			where: { student_id: student.id },
			attributes: ['id', 'student_id', 'created_at'],
		});
		
		return res.json(checkins);
	}
	
	async store(req, res) {
		const { studentId } = req.paramns;
		
		if (!studentId) {
			return res.status(400).json({ error: 'Student not provided.'})
		}
		
		const student = await Student.findByPk(studentId);
		
		if (!student) {
			return status(400).json({ error: 'Student does not exist.' })
		}
		
		// 5 checkins whith last 7 days
		const seventhDayAgo = subDays(new Date(), 7);
		const today = endOfDay(new Date());
		
		// Query of dates between seventhDayAgo(actual date plus 7 days) and today(actual date)
		const checkins = await Checkin.count({
			where: 
				{ student_id: student.id,
				created_at: {
					[Op.between]: [seventhDayAgo, today],
				}
			}
		});
		
		// Verify if string checkins if student entry is greater than or equal to 5
		if (checkins >= 5) {
			return res.status(400).json({error: 'Student already has 5 checkins in the last 7 days. . Access denied!'})
		}
		
		const { id, student_id } = await Checkin.create({
			student_id: student_id
		});
		
		return res.json({ id, student_id })
		
	}
}

export default new CheckinController();