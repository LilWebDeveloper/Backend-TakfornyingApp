import express from "express";
import controller from '../controllers/Employee'

const router = express.Router();

router.post('/new', controller.createEmployee);
router.get('/', controller.readAllEmployees);
router.get('/:employeeId', controller.readEmployee);
router.patch('/:employeeId/edit', controller.updateEmployee);
router.delete('/:employeeId', controller.deleteEmployee);

export = router;