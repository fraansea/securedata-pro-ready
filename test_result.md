============================= test session starts ==============================
platform darwin -- Python 3.9.6, pytest-8.4.1, pluggy-1.6.0 -- /Applications/Xcode.app/Contents/Developer/usr/bin/python3
cachedir: .pytest_cache
rootdir: /Users/francis/Desktop/securedata-main
plugins: anyio-3.7.1
collecting ... collected 16 items

backend_test.py::test_health_check FAILED                                [  6%]
backend_test.py::test_user_registration FAILED                           [ 12%]
backend_test.py::test_user_login FAILED                                  [ 18%]
backend_test.py::test_get_current_user FAILED                            [ 25%]
backend_test.py::test_create_folder FAILED                               [ 31%]
backend_test.py::test_list_folders FAILED                                [ 37%]
backend_test.py::test_file_upload FAILED                                 [ 43%]
backend_test.py::test_list_files FAILED                                  [ 50%]
backend_test.py::test_download_file FAILED                               [ 56%]
backend_test.py::test_delete_file FAILED                                 [ 62%]
backend_test.py::test_delete_folder FAILED                               [ 68%]
backend_test.py::test_duplicate_registration FAILED                      [ 75%]
backend_test.py::test_invalid_login FAILED                               [ 81%]
backend_test.py::test_unauthorized_access FAILED                         [ 87%]
backend_test.py::test_register PASSED                                    [ 93%]
backend_test.py::test_login PASSED                                       [100%]

=================================== FAILURES ===================================
______________________________ test_health_check _______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_health_check():
        """Test the health check endpoint"""
        print_separator("Testing Health Check")
    
        response = requests.get(f"{BACKEND_URL}/health")
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:52: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================= Testing Health Check =============================
================================================================================

Response Status: 404
____________________________ test_user_registration ____________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_user_registration():
        """Test user registration"""
        global auth_token, user_data
    
        print_separator("Testing User Registration")
    
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=TEST_USER
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:70: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
========================== Testing User Registration ===========================
================================================================================

Response Status: 404
_______________________________ test_user_login ________________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_user_login():
        """Test user login"""
        global auth_token
    
        print_separator("Testing User Login")
    
        login_data = {
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
    
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json=login_data
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:99: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================== Testing User Login ==============================
================================================================================

Response Status: 404
____________________________ test_get_current_user _____________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_get_current_user():
        """Test getting current user profile"""
        print_separator("Testing Get Current User")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:122: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
=========================== Testing Get Current User ===========================
================================================================================

Response Status: 404
______________________________ test_create_folder ______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_create_folder():
        """Test folder creation"""
        global test_folder_id
    
        print_separator("Testing Folder Creation")
    
        folder_data = {
            "name": f"Test Folder {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "parent_id": None
        }
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.post(
            f"{BACKEND_URL}/folders",
            json=folder_data,
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:150: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
=========================== Testing Folder Creation ============================
================================================================================

Response Status: 404
______________________________ test_list_folders _______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_list_folders():
        """Test listing folders"""
        print_separator("Testing Folder Listing")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.get(
            f"{BACKEND_URL}/folders",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:173: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================ Testing Folder Listing ============================
================================================================================

Response Status: 404
_______________________________ test_file_upload _______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_file_upload():
        """Test file upload with encryption"""
        global test_file_id, uploaded_file_content
    
        print_separator("Testing File Upload")
    
        # Generate a random text file
        file_content = generate_random_file(size_kb=5)
        uploaded_file_content = file_content
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        # Create a temporary file
        filename = f"test_file_{uuid.uuid4()}.txt"
    
        files = {
            'file': (filename, file_content, 'text/plain')
        }
    
        data = {
            'folder_id': test_folder_id
        }
    
        response = requests.post(
            f"{BACKEND_URL}/files/upload",
            headers=headers,
            files=files,
            data=data
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:215: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================= Testing File Upload ==============================
================================================================================

Response Status: 404
_______________________________ test_list_files ________________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_list_files():
        """Test listing files"""
        print_separator("Testing File Listing")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        # Test listing files in a specific folder
        response = requests.get(
            f"{BACKEND_URL}/files?folder_id={test_folder_id}",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:240: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================= Testing File Listing =============================
================================================================================

Response Status: 404
______________________________ test_download_file ______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_download_file():
        """Test file download and decryption"""
        print_separator("Testing File Download")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.get(
            f"{BACKEND_URL}/files/{test_file_id}/download",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {json.dumps(response.json(), indent=2)[:200]}...")  # Truncate for readability

backend_test.py:263: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================ Testing File Download =============================
================================================================================

Response Status: 404
_______________________________ test_delete_file _______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_delete_file():
        """Test file deletion"""
        print_separator("Testing File Deletion")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.delete(
            f"{BACKEND_URL}/files/{test_file_id}",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:288: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================ Testing File Deletion =============================
================================================================================

Response Status: 404
______________________________ test_delete_folder ______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_delete_folder():
        """Test folder deletion"""
        print_separator("Testing Folder Deletion")
    
        headers = {"Authorization": f"Bearer {auth_token}"}
    
        response = requests.delete(
            f"{BACKEND_URL}/folders/{test_folder_id}",
            headers=headers
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:316: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
=========================== Testing Folder Deletion ============================
================================================================================

Response Status: 404
_________________________ test_duplicate_registration __________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_duplicate_registration():
        """Test duplicate user registration (should fail)"""
        print_separator("Testing Duplicate User Registration")
    
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=TEST_USER
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:342: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
===================== Testing Duplicate User Registration ======================
================================================================================

Response Status: 404
______________________________ test_invalid_login ______________________________

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
>           return complexjson.loads(self.text, **kwargs)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:976: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py:346: in loads
    return _default_decoder.decode(s)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <json.decoder.JSONDecoder object at 0x103777df0>
s = '404 page not found\n'
_w = <built-in method match of re.Pattern object at 0x1034f39f0>

    def decode(self, s, _w=WHITESPACE.match):
        """Return the Python representation of ``s`` (a ``str`` instance
        containing a JSON document).
    
        """
        obj, end = self.raw_decode(s, idx=_w(s, 0).end())
        end = _w(s, end).end()
        if end != len(s):
>           raise JSONDecodeError("Extra data", s, end)
E           json.decoder.JSONDecodeError: Extra data: line 1 column 5 (char 4)

/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py:340: JSONDecodeError

During handling of the above exception, another exception occurred:

    def test_invalid_login():
        """Test invalid login credentials"""
        print_separator("Testing Invalid Login")
    
        login_data = {
            "email": TEST_USER["email"],
            "password": "WrongPassword123!"
        }
    
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json=login_data
        )
    
        print(f"Response Status: {response.status_code}")
>       print(f"Response Body: {response.json()}")

backend_test.py:364: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [404]>, kwargs = {}

    def json(self, **kwargs):
        r"""Decodes the JSON response body (if any) as a Python object.
    
        This may return a dictionary, list, etc. depending on what is in the response.
    
        :param \*\*kwargs: Optional arguments that ``json.loads`` takes.
        :raises requests.exceptions.JSONDecodeError: If the response body does not
            contain valid json.
        """
    
        if not self.encoding and self.content and len(self.content) > 3:
            # No encoding set. JSON RFC 4627 section 3 states we should expect
            # UTF-8, -16 or -32. Detect which one to use; If the detection or
            # decoding fails, fall back to `self.text` (using charset_normalizer to make
            # a best guess).
            encoding = guess_json_utf(self.content)
            if encoding is not None:
                try:
                    return complexjson.loads(self.content.decode(encoding), **kwargs)
                except UnicodeDecodeError:
                    # Wrong UTF codec detected; usually because it's not UTF-8
                    # but some other 8-bit codec.  This is an RFC violation,
                    # and the server didn't bother to tell us what codec *was*
                    # used.
                    pass
                except JSONDecodeError as e:
                    raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
    
        try:
            return complexjson.loads(self.text, **kwargs)
        except JSONDecodeError as e:
            # Catch JSON-related errors and raise as requests.JSONDecodeError
            # This aliases json.JSONDecodeError and simplejson.JSONDecodeError
>           raise RequestsJSONDecodeError(e.msg, e.doc, e.pos)
E           requests.exceptions.JSONDecodeError: Extra data: line 1 column 5 (char 4)

../../Library/Python/3.9/lib/python/site-packages/requests/models.py:980: JSONDecodeError
----------------------------- Captured stdout call -----------------------------

================================================================================
============================ Testing Invalid Login =============================
================================================================================

Response Status: 404
___________________________ test_unauthorized_access ___________________________

    def test_unauthorized_access():
        """Test unauthorized access to protected endpoints"""
        print_separator("Testing Unauthorized Access")
    
        # Try to access a protected endpoint without a token
        response = requests.get(f"{BACKEND_URL}/folders")
    
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
    
>       assert response.status_code in [401, 403]  # Either unauthorized or forbidden
E       assert 404 in [401, 403]
E        +  where 404 = <Response [404]>.status_code

backend_test.py:381: AssertionError
----------------------------- Captured stdout call -----------------------------

================================================================================
========================= Testing Unauthorized Access ==========================
================================================================================

Response Status: 404
Response Body: 404 page not found

=============================== warnings summary ===============================
../../Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35
  /Users/francis/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
=========================== short test summary info ============================
FAILED backend_test.py::test_health_check - requests.exceptions.JSONDecodeErr...
FAILED backend_test.py::test_user_registration - requests.exceptions.JSONDeco...
FAILED backend_test.py::test_user_login - requests.exceptions.JSONDecodeError...
FAILED backend_test.py::test_get_current_user - requests.exceptions.JSONDecod...
FAILED backend_test.py::test_create_folder - requests.exceptions.JSONDecodeEr...
FAILED backend_test.py::test_list_folders - requests.exceptions.JSONDecodeErr...
FAILED backend_test.py::test_file_upload - requests.exceptions.JSONDecodeErro...
FAILED backend_test.py::test_list_files - requests.exceptions.JSONDecodeError...
FAILED backend_test.py::test_download_file - requests.exceptions.JSONDecodeEr...
FAILED backend_test.py::test_delete_file - requests.exceptions.JSONDecodeErro...
FAILED backend_test.py::test_delete_folder - requests.exceptions.JSONDecodeEr...
FAILED backend_test.py::test_duplicate_registration - requests.exceptions.JSO...
FAILED backend_test.py::test_invalid_login - requests.exceptions.JSONDecodeEr...
FAILED backend_test.py::test_unauthorized_access - assert 404 in [401, 403]
=================== 14 failed, 2 passed, 1 warning in 17.26s ===================
