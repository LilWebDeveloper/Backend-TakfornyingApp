import express from "express";
import controller from '../controllers/Employee'

const router = express.Router();

router.post('/', controller.createEmployee);
router.get('/', controller.readAllEmployees);
router.get('/:employeeId', controller.readEmployee);
router.patch('/:employeeId', controller.updateEmployee);
router.delete('/:employeeId', controller.deleteEmployee);

export = router;