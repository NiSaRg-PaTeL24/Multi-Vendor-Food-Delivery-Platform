import Layout from '../components/Layout';
import FoodTable from '../components/FoodTable';
import { useUser } from '@auth0/nextjs-auth0/client';
import dbConnect from '../lib/mongodb';
import Food from '../models/Food';

export default function HomePage({ foods }) {
  const { user, isLoading } = useUser();
  
  return (
    <Layout>
      <FoodTable foods={foods} isAuthenticated={!!user} />
    </Layout>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  
  // Fetch foods
  const foodsResult = await Food.find({});
  const foods = JSON.parse(JSON.stringify(foodsResult));
  
  return {
    props: { 
      foods
    }
  };
}