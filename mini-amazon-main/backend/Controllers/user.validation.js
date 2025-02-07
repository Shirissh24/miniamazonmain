import yup from 'yup';

const userValidationSchema = yup.object ({
    firstName: yup.string().required().max(255),
    lastName: yup.string().required().max(100),
    password: yup.string().required().max(100).trim(),
    email: yup.string().required().email().max(100),
    phoneNumber: yup.number().notRequired().max(20),
    address: yup.string().required().max(255),
    dateOfBirth: yup.date().required(),
    gender: yup.string().required().oneOf(["Male", "Female", "Other"]),
    });

export default userValidationSchema;