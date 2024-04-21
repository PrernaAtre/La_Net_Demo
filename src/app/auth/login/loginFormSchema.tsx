import * as Yup from 'yup';

export const loginFormSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required('Please enter email'),
    password: Yup.string().required('Please enter password') 
});
