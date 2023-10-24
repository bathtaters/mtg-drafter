const errors: Record<number,string> = {
    0:   "Unknown error code",
    100: "Continue",
    101: "Switching protocols",
    102: "Processing",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non authoritative information",
    204: "No content",
    205: "Reset content",
    206: "Partial content",
    207: "Multi-status",
    300: "Multiple choices",
    301: "Moved permanently",
    302: "Moved temporarily",
    303: "See other",
    304: "Not modified",
    305: "Use proxy",
    307: "Temporary redirect",
    308: "Permanent redirect",
    400: "Bad request",
    401: "User not authorized",
    402: "Payment required",
    403: "Access forbidden",
    404: "Page not found",
    405: "Method not allowed",
    406: "Not acceptable",
    407: "Proxy authentication required",
    408: "Request timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length required",
    412: "Precondition failed",
    413: "Request entity too large",
    414: "Request-URI too long",
    415: "Unsupported media type",
    416: "Requested range not satisfiable",
    417: "Expectation failed",
    418: "I'm a teapot",
    419: "Insufficient space on resource",
    420: "Method failure",
    421: "Misdirected request",
    422: "Unprocessable entity",
    423: "Locked",
    424: "Failed dependency",
    428: "Precondition required",
    429: "Too many requests, please try again in a few minutes",
    431: "Request header fields too large",
    451: "Unavailable for legal reasons",
    500: "Server error",
    501: "Not implemented",
    502: "Bad gateway",
    503: "Service unavailable",
    504: "Gateway timeout",
    505: "HTTP version not supported",
    507: "Insufficient storage",
    511: "Network authentication required",
}

export default errors