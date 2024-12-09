<!DOCTYPE html>
<html>
<head>
    <title>{{ $lesson->naziv }}</title>
</head>
<body>
    <h1>{{ $lesson->naziv }}</h1>
    <p>{{ $lesson->tekst }}</p>
    <p><strong>Predjena:</strong> {{ $lesson->predjena ? 'Da' : 'Ne' }}</p>
    <p><strong>Jezik ID:</strong> {{ $lesson->language_id }}</p>
</body>
</html>
