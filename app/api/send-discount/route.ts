import { NextRequest, NextResponse } from 'next/server';

// In-memory store for emails that have already claimed discounts
// In production, this should be a database
const claimedEmails = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, prizeId, discount, percentage } = body;
    // dob is optional now
    const dob = body.dob || '';

    // Validate required fields (name, email, prizeId)
    if (!name || !email || !prizeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const normalizedEmail = email.trim().toLowerCase();
    if (claimedEmails.has(normalizedEmail)) {
      return NextResponse.json(
        { error: 'This email has already been used to claim a discount code.' },
        { status: 409 }
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

    // Mark email as claimed
    claimedEmails.add(normalizedEmail);

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
