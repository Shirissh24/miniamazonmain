import yup from 'yup';

const productValidationSchema = yup.object ({
        name: yup.string().required().max(150),
        price: yup.number().required().min(0),
        brand: yup.string().required().max(150),
        category: yup.string().required().oneOf([ "grocery",
            "electronics",
            "electrical",
            "clothing",
            "kitchen",
            "kids",
            "laundry",]),
        image: yup.string().notRequired(),
        quantity: yup.number().required().min(1, "Quantity must be at least 1"),
        description: yup.string().required().trim().min(10).max(1000),
        image: yup.string().notRequired().trim(),
    });

export default productValidationSchema;