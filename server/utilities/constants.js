const roles = {
    client: {
      key: "client",
      title: "Client",
    },
    partner: {
      key: "partner",
      title: "Partner",
    },
    physio: {
      key: "physio",
      title: "Physio",
    },
    doctor: {
      key: "doctor",
      title: "Doctor",
    },
    admin: {
      key: "admin",
      title: "Admin",
    },
  };
  
  const roleKeys = ["client", "partner", "physio", "doctor", "admin"];
  
  const questionSegments = {
    selfDiagnostic: {
      key: "selfDiagnostic",
      title: "Self Diagnostic",
    },
  };
  
  const painPoints = [
    "lowerBack",
    "upperBack",
    "neck",
    "shoulder",
    "knee",
    "hip",
    "ankle",
    "elbow",
    "wristAndHand",
  ];
  
  const difficulty = ["easy", "moderate", "hard"];
  
  const painPerception = ["severe", "moderate", "mild", "slightPain", "noPain"];
  const profiles = ['Admin', 'Doctor', 'Physio', 'Client'];
  const paymentPlans = {
    monthly: 99900,
    quarterly: 189900,
    // halfyearly: 164900,
    yearly: 599900,
  };
  
  export default  {
    roles,
    roleKeys,
    questionSegments,
    painPoints,
    difficulty,
    paymentPlans,
    painPerception,
    profiles
  };
  