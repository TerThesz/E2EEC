module.exports = {
  sc: new class StatusCodes {
    200 = () =>  [ 'OK', 'indicates that the request has succeeded.' ]
    201 = () =>  [ 'Created', 'indicates that the request has been fulfilled and has resulted in one or more new resources being created.' ]
    202 = () =>  [ 'Accepted', 'indicates that the request has been accepted for processing, but the processing has not been completed.' ]
    204 = () =>  [ 'No Content', 'indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.' ]
    205 = () =>  [ 'Reset Content', 'indicates that the server has fulfilled the request and desires that the user agent reset the document view, which caused the request to be sent, to its original state as received from the origin server.' ]
    
    304 = () => [ 'Not Modified', 'indicates that a conditional GET request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition has evaluated to false.' ]

    400 = () =>  [ 'Bad Request', 'indicates that the server cannot or will not process the request because the received syntax is invalid, nonsensical, or exceeds some limitation on what the server is willing to process.' ]
    401 = () =>  [ 'Unauthorized', 'indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.' ]
    403 = () =>  [ 'Forbidden', 'indicates that the server understood the request but refuses to authorize it.' ]
    404 = () =>  [ 'Not Found', 'indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.' ]
    405 = () =>  [ 'Method Not Allowed', 'indicates that the request method is known by the server but is not supported by the target resource.' ]
    411 = () =>  [ 'Length Required', 'indicates that the server refuses to accept the request without a defined Content-Length.' ]
    413 = () =>  [ 'Payload Too Large', 'indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process.' ]
    415 = () =>  [ 'Unsupported Media Type', 'indicates that the origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method.' ]
    429 = () =>  [ 'Too Many Requests', 'indicates that the user has sent too many requests in a given amount of time (rate limiting).' ]

    500 = () =>  [ 'Internal Server Error', 'indicates that the server does not support the functionality required to fulfill the request.' ]
    507 = () =>  [ 'Insufficient Storage', 'means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.' ]
  },

  ac: new class AuthCodes {
    600 = () => [ 'Invalid AppId', 'The specified appid is not valid.' ]
    601 = () => [ 'Insufficient Permissions', 'You can not access this route with this appid.' ]
  }
}
