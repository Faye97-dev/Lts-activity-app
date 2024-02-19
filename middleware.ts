// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    // get the URL from request header
    const requestHeaders = new Headers(request.headers);
    const baseUrl = process.env.APP_URL || ""
    var pathaname = request.url.replace(baseUrl, '');
    requestHeaders.set('location', pathaname);

    // pass the header to the layout
    return NextResponse.next({ request: { headers: requestHeaders } });
}