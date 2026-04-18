import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, method = 'POST', data = {}, headers = {} } = body;

    const targetUrl = `https://20wickets.com${endpoint}`;
    
    // Exact headers from successful fetch
    const response = await axios({
      url: targetUrl,
      method: method,
      data: data,
      headers: {
        ...headers,
        'Referer': 'https://20wickets.com/home',
        'Origin': 'https://20wickets.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Proxy Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from remote server', details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}
