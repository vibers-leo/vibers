import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'b1',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
      link: '/shop/new',
      position: 'main_top',
      status: 'active'
    }
  ]);
}
