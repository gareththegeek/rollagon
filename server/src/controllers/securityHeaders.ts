import { Request, Response, NextFunction } from 'express'

const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? '*'

export const handler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN)
    res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    )
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; connect-src 'self'; font-src 'self' https://use.typekit.net/; img-src 'self'; script-src 'self'; style-src 'self' https://use.typekit.net/ https://p.typekit.net/; frame-src 'self';"
    )
    res.setHeader(
        'Permissions-Policy',
        'ambient-light-sensor=(), autoplay=(), accelerometer=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), speaker=(), sync-xhr=(), usb=(), wake-lock=(), vr=(), xr-spatial-tracking=()'
    )
    res.setHeader('X-Frame-Options', 'sameorigin')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    next()
}
