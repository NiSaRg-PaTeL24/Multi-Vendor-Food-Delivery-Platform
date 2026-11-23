import Layout from '../components/Layout';
import AddFoodForm from '../components/AddFoodForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

function AddFoodPage() {
  return (
    <Layout>
      <AddFoodForm />
    </Layout>
  );
}

// This ensures that the page is only accessible to authenticated users
export const getServerSideProps = withPageAuthRequired();

export default AddFoodPage;