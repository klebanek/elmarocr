<?php
/**
 * ELMAR PWA - PDF Upload Handler
 * Securely handles PDF uploads from the frontend application.
 */

// Set response header to JSON
header('Content-Type: application/json');

// 1. Basic configuration
$upload_dir = 'pdf_documents/';
$allowed_extensions = ['pdf'];
$allowed_mime_types = ['application/pdf'];
$max_file_size = 10 * 1024 * 1024; // 10MB

// 2. Ensure upload directory exists and is secure
if (!file_exists($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit;
    }
    // Create .htaccess to prevent script execution in the upload directory
    file_put_contents($upload_dir . '.htaccess', "php_flag engine off\nOptions -Indexes");
    // Create index.php to prevent directory listing
    file_put_contents($upload_dir . 'index.php', '<?php http_response_code(403); ?>');
}

// 3. Handle POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// 4. Check if file was uploaded
if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

// 5. Validate file upload for errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    $error_messages = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload',
    ];
    $msg = $error_messages[$file['error']] ?? 'Unknown upload error';
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

// 6. Validate file size
if ($file['size'] > $max_file_size) {
    echo json_encode(['success' => false, 'message' => 'File too large (max 10MB)']);
    exit;
}

// 7. Validate file extension and MIME type
$file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($file_ext, $allowed_extensions)) {
    echo json_encode(['success' => false, 'message' => 'Only PDF files are allowed (extension)']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($file['tmp_name']);
if (!in_array($mime_type, $allowed_mime_types)) {
    echo json_encode(['success' => false, 'message' => 'Only PDF files are allowed (MIME type)']);
    exit;
}

// 8. Sanitize metadata for filename
$worker = $_POST['worker'] ?? 'unknown';
$date = $_POST['date'] ?? date('Y-m-d');

// Remove anything that isn't alphanumeric, space, dot, underscore or hyphen
$safe_worker = preg_replace('/[^a-zA-Z0-9\s_\-]/', '', $worker);
$safe_worker = substr(str_replace(' ', '_', $safe_worker), 0, 50);

$safe_date = preg_replace('/[^0-9\-]/', '', $date);
$safe_date = substr($safe_date, 0, 10);

// 9. Generate a safe, unique filename
$unique_id = bin2hex(random_bytes(8));
$new_filename = "WZ_{$safe_date}_{$safe_worker}_{$unique_id}.pdf";

$target_path = $upload_dir . $new_filename;

// 10. Move the file
if (move_uploaded_file($file['tmp_name'], $target_path)) {
    // Log success (optional)
    echo json_encode([
        'success' => true,
        'message' => 'Plik PDF został wysłany do biura!',
        'filename' => $new_filename
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Błąd podczas zapisywania pliku na serwerze']);
}
