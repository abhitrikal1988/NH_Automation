//const { test, expect } = require('@playwright/test');
const {  test, expect } = require('../../Utils/MongoDbConnection.js');

test('Should fetch data from MongoDB', async ({ page, db }) => {
    const MCPMember = db.collection('MCPMember');

    // Validation: Confirm database updates natively if needed
    const MemberDetails = await MCPMember.findOne({ MCPMember_ID: 24789 });
    console.log('MemberDetails:', MemberDetails);
    expect(MemberDetails?.FirstName).toBe('MBI0A05UQ48_FName');
  });
