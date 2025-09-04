<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa;
        }
        .card {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .error-message {
            color: red;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h3 class="text-center">Reset Password</h3>
        <form id="reset-password-form">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">
            <input type="hidden" name="email" value="{{ request()->email }}">
            <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input type="password" name="password" id="password" class="form-control" required>
                <span id="password-error" class="error-message"></span>
            </div>
            <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirm Password</label>
                <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" required>
                <span id="password-confirmation-error" class="error-message"></span>
            </div>
            <button type="submit" class="btn btn-primary w-100">Reset Password</button>
            <div id="success-message" class="text-success mt-3" style="display: none;"></div>
            <div id="error-message" class="text-danger mt-3" style="display: none;"></div>
        </form>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Axios for AJAX -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        const form = document.getElementById('reset-password-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            // Reset error messages
            document.getElementById('password-error').textContent = '';
            document.getElementById('password-confirmation-error').textContent = '';
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('error-message').style.display = 'none';

            try {
                const response = await axios.post('{{ url("/api/reset-password") }}', {
                    token: formData.get('token'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    password_confirmation: formData.get('password_confirmation')
                });

                // Show success message
                document.getElementById('success-message').textContent = response.data.message;
                document.getElementById('success-message').style.display = 'block';
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    const errors = error.response.data.errors;
                    if (errors.password) {
                        document.getElementById('password-error').textContent = errors.password[0];
                    }
                    if (errors.password_confirmation) {
                        document.getElementById('password-confirmation-error').textContent = errors.password_confirmation[0];
                    }
                } else {
                    // Show generic error message
                    document.getElementById('error-message').textContent = 'An error occurred while resetting the password.';
                    document.getElementById('error-message').style.display = 'block';
                }
            }
        });
    </script>
</body>
</html>
