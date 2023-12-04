// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    // get the URL from request header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.url);

    // todo
    // const urlWithoutHttps = request.url?.split('//')?.[1]
    // console.log(urlWithoutHttps.split('/'), "request")
    // console.log(request., request.url)

    // pass the header to the layout
    return NextResponse.next({ request: { headers: requestHeaders, } });
}