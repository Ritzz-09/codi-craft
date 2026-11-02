import json
import unittest
from unittest.mock import patch

from backend import app


class ApiContractTests(unittest.TestCase):
    def setUp(self):
        self.client = app.app.test_client()

    def test_health_returns_request_trace_and_security_headers(self):
        response = self.client.get("/health", headers={"X-Request-ID": "test-trace"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["X-Request-ID"], "test-trace")
        self.assertIn("default-src 'none'", response.headers["Content-Security-Policy"])
        self.assertTrue(response.get_json()["byok_required"])

    def test_ready_does_not_require_a_server_owned_key(self):
        response = self.client.get("/ready")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["byok_required"])

    def test_unknown_route_returns_json_error_with_request_id(self):
        response = self.client.get("/does-not-exist")

        self.assertEqual(response.status_code, 404)
        self.assertTrue(response.is_json)
        self.assertTrue(response.get_json()["request_id"])

    def test_execution_is_disabled_by_default(self):
        response = self.client.post("/run", json={"language": "Python", "code": "print(1)"})

        self.assertEqual(response.status_code, 403)
        self.assertIn("disabled", response.get_json()["error"])

    def test_svg_image_attachment_is_rejected(self):
        response = self.client.post(
            "/generate",
            json={
                "description": "Create a Python script.",
                "language": "Python",
                "attachments": [
                    {
                        "name": "unsafe.svg",
                        "kind": "image",
                        "data_url": "data:image/svg+xml;base64,PHN2Zz4=",
                    }
                ],
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("PNG, JPEG, WebP, or GIF", response.get_json()["error"])

    def test_generation_requires_a_user_owned_key(self):
        response = self.client.post(
            "/generate",
            json={
                "description": "Create a Python script that adds two numbers.",
                "language": "Python",
                "api_provider": "groq",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("API key", response.get_json()["error"])

    @patch("backend.app.generate_with_provider")
    def test_user_key_is_not_returned_or_persisted_in_response(self, generate_with_provider):
        user_key = "user-owned-key-1234567890"
        generate_with_provider.return_value = json.dumps(
            {
                "summary": "Hello script",
                "usage": "Run python main.py",
                "notes": [],
                "files": [{"path": "main.py", "content": "print('hello')", "role": "main"}],
            }
        )

        response = self.client.post(
            "/generate",
            json={
                "description": "Create a Python script that prints hello.",
                "language": "Python",
                "api_provider": "openai",
                "api_key": user_key,
                "model": "gpt-4.1-mini",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(generate_with_provider.call_args.args[0:2], ("openai", user_key))
        self.assertNotIn(user_key, json.dumps(response.get_json()))


if __name__ == "__main__":
    unittest.main()
