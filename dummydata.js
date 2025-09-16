import mongoose from "mongoose";

const users = [
  {
    _id: "68c6c7e6a7f3fbc03259f466",
    name: "Admin User",
    email: "admin@schoolapp.com",
    password: "admin@schoolapp.com",
    role: "admin",
  },
  {
    _id: "68c6c7e6a7f3fbc03259f467",
    name: "John Smith",
    email: "john@trustee.com",
    password: "john@trustee.com",
    role: "trustee",
  },
  {
    _id: "68c6c7e6a7f3fbc03259f468",
    name: "Sarah Johnson",
    email: "sarah@trustee.com",
    password: "sarah@trustee.com",
    role: "trustee",
  },
];

// Generate 50 orders
export const orders = [];
export const orderStatuses = [];

// Generate 14-digit school IDs
const schools = [
  "67891234098765",
  "12345678901234",
  "98765432109876",
  "56789012345678",
  "34567890123456",
];
export const mockSchools = {
  67891234098765: "Greenwood High School",
  12345678901234: "Riverside Academy",
  98765432109876: "Sunshine Public School",
  56789012345678: "Maplewood International",
  34567890123456: "Pinecrest Elementary",
  45678901234567: "Oakridge Secondary School",
  23456789012345: "Westfield Preparatory",
  89012345678901: "Northside Charter School",
  90123456789012: "Eastwood Grammar School",
  78901234567890: "Central City High School",
};
const trustees = ["TRUST001", "TRUST002", "TRUST003"];
const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emma",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Jessica",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];
const paymentModes = [
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "UPI",
  "Wallet",
];
const statuses = ["PENDING", "SUCCESS", "FAILED"];

// Generate random dates within the last 6 months
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 6);

for (let i = 1; i <= 50; i++) {
  const orderId = new mongoose.Types.ObjectId();
  const createdAt = getRandomDate(startDate, new Date());
  const studentId = `STU2023${i.toString().padStart(3, "0")}`;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const school = schools[Math.floor(Math.random() * schools.length)];
  const trustee = trustees[Math.floor(Math.random() * trustees.length)];

  // Create order
  orders.push({
    _id: orderId,
    school_id: school,
    trustee_id: trustee,
    student_info: {
      name: `${firstName} ${lastName}`,
      student_id: studentId,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.com`,
    },
    gateway_name: "Edviron",
    createdAt: createdAt,
    updatedAt: createdAt,
  });

  // Create corresponding order status
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const orderAmount = Math.floor(Math.random() * 5000) + 1000; // Random amount between 1000 and 6000

  let transactionAmount,
    paymentTime,
    paymentMode,
    paymentDetails,
    bankReference,
    paymentMessage,
    errorMessage;

  if (status === "SUCCESS") {
    transactionAmount = orderAmount;
    paymentTime = new Date(createdAt.getTime() + 5 * 60000); // 5 minutes after order creation
    paymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];
    paymentDetails = `${paymentMode} transaction`;
    bankReference = `BANKREF${i.toString().padStart(3, "0")}`;
    paymentMessage = "Payment successful";
    errorMessage = null;
  } else if (status === "FAILED") {
    transactionAmount = 0;
    paymentTime = null;
    paymentMode = null;
    paymentDetails = null;
    bankReference = null;
    paymentMessage = "Payment failed";
    errorMessage = "Insufficient funds";
  } else {
    // PENDING
    transactionAmount = null;
    paymentTime = null;
    paymentMode = null;
    paymentDetails = null;
    bankReference = null;
    paymentMessage = null;
    errorMessage = null;
  }

  orderStatuses.push({
    collect_id: orderId,
    user_id: user._id,
    collect_request_id: `REQ${i.toString().padStart(3, "0")}`,
    order_amount: orderAmount,
    transaction_amount: transactionAmount,
    payment_mode: paymentMode,
    payment_details: paymentDetails,
    bank_reference: bankReference,
    payment_message: paymentMessage,
    status: status,
    error_message: errorMessage,
    payment_time: paymentTime,
    createdAt: createdAt,
    updatedAt: paymentTime || createdAt,
  });
}
//  { orders, orderStatuses };
