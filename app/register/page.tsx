export const revalidate = 0;

import Container from '../components/Container';
import FormWrap from '../components/FormWrap';
import RegisterForm from './RegisterForm';

const Register = async () => {
  return (
    <Container>
      <FormWrap>
        <RegisterForm />
      </FormWrap>
    </Container>
  );
};

export default Register;