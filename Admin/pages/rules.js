import Layout from '../components/Layout';
import RulesForm from '../components/RulesForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import dbConnect from '../lib/mongodb';
import Rule from '../models/Rule';

function RulesPage({ rules }) {
  return (
    <Layout>
      <RulesForm initialRules={rules} />
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps() {
    await dbConnect();
    
    // Get active rules
    const ruleModel = await Rule.getActiveRules();
    const rules = JSON.parse(JSON.stringify(ruleModel));
    
    return {
      props: { rules }
    };
  }
});

export default RulesPage;