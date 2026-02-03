import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, dob, prizeId, discount, percentage } = body;

    // Validate input
    if (!name || !email || !dob || !prizeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate discount code
    const discountCode = `NAILS${percentage}OFF${Date.now().toString().slice(-4)}`;

    // Mock: Simulate sending email
    console.log('[Mock Email Service]');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`DOB: ${dob}`);
    console.log(`Prize: ${discount}`);
    console.log(`Discount Code: ${discountCode}`);
    console.log(
      `Email: You have won ${discount} off! Use code: ${discountCode}`
    );

    // In a real application, you would:
    // 1. Send email via SendGrid, Resend, etc.
    // 2. Store user data in database
    // 3. Track discount usage

    // Mock delay to simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        message: 'Discount code sent successfully',
        discountCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
