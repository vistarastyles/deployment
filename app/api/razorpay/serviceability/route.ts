// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db";
// import { addresses } from "@/db/schema";
// import { getAuth } from "@clerk/nextjs/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const address = await req.json();
//     console.log("📦 Received address:", address);

//     const {
//       first_name,
//       last_name,
//       address_line1,
//       address_line2,
//       city,
//       state,
//       country,
//       zipcode,
//       phone,
//       email,
//     } = address;

//     await db.insert(addresses).values({
//       userId,
//       firstName: first_name,
//       lastName: last_name || null,
//       addressLine1: address_line1,
//       addressLine2: address_line2 || null,
//       city,
//       state,
//       country,
//       pincode: zipcode,
//       phone,
//       email,
//     });

//     return NextResponse.json({
//       serviceable: true,
//       cod_serviceable: true,
//       shipping_fee: 0,
//       cod_fee: 0,
//     });
//   } catch (error) {
//     console.error(
//       "❌ Error storing address or checking serviceability:",
//       error
//     );
//     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//   }
// }
