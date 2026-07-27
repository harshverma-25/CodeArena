import { Router } from 'express';
import { openApiSpec } from './openapi.js';

const router = Router();

// Endpoint: GET /api/swagger.json
router.get('/swagger.json', (req, res) => {
  res.json(openApiSpec);
});

// Endpoint: GET /api/docs
router.get('/docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeArena API Reference</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png" sizes="32x32" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      background-color: #0b0f19;
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
    }
    
    /* Premium Header */
    .custom-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      padding: 24px 40px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .custom-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(to right, #a855f7, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .badge {
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.3);
      color: #c084fc;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Swagger Dark Theme Styles */
    .swagger-ui {
      background-color: #0b0f19 !important;
      font-family: 'Inter', sans-serif !important;
      padding-top: 20px;
    }

    .swagger-ui .info, 
    .swagger-ui .scheme-container {
      background-color: #0f172a !important;
      border-radius: 12px;
      border: 1px solid #1e293b !important;
      padding: 30px !important;
      margin: 20px 40px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .swagger-ui .scheme-container {
      padding: 15px 30px !important;
    }

    .swagger-ui .info .title,
    .swagger-ui .info td,
    .swagger-ui .info p,
    .swagger-ui .info li,
    .swagger-ui .info a,
    .swagger-ui .opblock-tag,
    .swagger-ui .opblock .opblock-summary-operation-id,
    .swagger-ui .opblock .opblock-summary-path,
    .swagger-ui .opblock .opblock-summary-description,
    .swagger-ui .tabli,
    .swagger-ui .response-col_status,
    .swagger-ui .response-col_links,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in,
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th,
    .swagger-ui .model-title,
    .swagger-ui .model,
    .swagger-ui .opblock-description-wrapper p,
    .swagger-ui .opblock-external-docs-wrapper p,
    .swagger-ui .opblock-title_normal {
      color: #e2e8f0 !important;
    }

    .swagger-ui .opblock-tag {
      border-bottom: 1px solid #1e293b !important;
      font-size: 20px !important;
      padding: 10px 0 !important;
      margin: 20px 40px 10px 40px !important;
    }

    .swagger-ui .opblocks-list {
      padding: 0 40px !important;
    }

    .swagger-ui .opblock {
      background: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px !important;
    }

    .swagger-ui .opblock .opblock-summary {
      border-bottom: 1px solid #1e293b !important;
      padding: 12px 20px !important;
    }

    .swagger-ui .opblock.opblock-post {
      border-color: rgba(16, 185, 129, 0.3) !important;
      background: rgba(16, 185, 129, 0.03) !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary {
      border-bottom-color: rgba(16, 185, 129, 0.2) !important;
    }

    .swagger-ui .opblock.opblock-get {
      border-color: rgba(59, 130, 246, 0.3) !important;
      background: rgba(59, 130, 246, 0.03) !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary {
      border-bottom-color: rgba(59, 130, 246, 0.2) !important;
    }

    .swagger-ui .opblock.opblock-patch {
      border-color: rgba(245, 158, 11, 0.3) !important;
      background: rgba(245, 158, 11, 0.03) !important;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary {
      border-bottom-color: rgba(245, 158, 11, 0.2) !important;
    }

    .swagger-ui .opblock.opblock-delete {
      border-color: rgba(239, 68, 68, 0.3) !important;
      background: rgba(239, 68, 68, 0.03) !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary {
      border-bottom-color: rgba(239, 68, 68, 0.2) !important;
    }

    .swagger-ui .opblock .opblock-section-header {
      background: #1e293b !important;
      color: #e2e8f0 !important;
      border-bottom: 1px solid #334155 !important;
    }

    .swagger-ui input[type=text],
    .swagger-ui select,
    .swagger-ui textarea {
      background: #1e293b !important;
      color: #f3f4f6 !important;
      border: 1px solid #334155 !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
    }

    .swagger-ui .btn {
      border-radius: 6px !important;
      font-weight: 600 !important;
      border: 1px solid #334155 !important;
      background: #1e293b !important;
      color: #e2e8f0 !important;
      transition: all 0.2s;
    }

    .swagger-ui .btn:hover {
      background: #334155 !important;
    }

    .swagger-ui .btn.authorize {
      border-color: #a855f7 !important;
      color: #c084fc !important;
      background: rgba(168, 85, 247, 0.1) !important;
    }
    
    .swagger-ui .btn.authorize:hover {
      background: rgba(168, 85, 247, 0.2) !important;
    }

    .swagger-ui .dialog-ux .modal-ux {
      background-color: #0f172a !important;
      border: 1px solid #1e293b !important;
      border-radius: 12px !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    }

    .swagger-ui .dialog-ux .modal-ux-header {
      border-bottom: 1px solid #1e293b !important;
      padding: 15px 20px !important;
    }

    .swagger-ui .dialog-ux .modal-ux-header h3 {
      color: #f3f4f6 !important;
    }

    .swagger-ui .dialog-ux .modal-ux-content {
      padding: 20px !important;
    }

    .swagger-ui .dialog-ux .modal-ux-content p,
    .swagger-ui .dialog-ux .modal-ux-content h4 {
      color: #9ca3af !important;
    }

    .swagger-ui .models {
      border: 1px solid #1e293b !important;
      margin: 30px 40px !important;
      background: #0f172a !important;
      border-radius: 12px !important;
    }

    .swagger-ui .models.is-open {
      padding: 10px 0 !important;
    }

    .swagger-ui .models.is-open h3 {
      border-bottom: 1px solid #1e293b !important;
      padding-bottom: 10px !important;
      margin: 0 20px 10px 20px !important;
      color: #e2e8f0 !important;
    }

    .swagger-ui .model-box {
      background: #0b0f19 !important;
      border: 1px solid #1e293b !important;
      border-radius: 8px !important;
      padding: 12px !important;
    }
  </style>
</head>
<body>
  <header class="custom-header">
    <h1>CodeArena API Documentation</h1>
    <span class="badge">v1.0.0</span>
  </header>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/api/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
  `;
  res.send(html);
});

export const docsRoutes = router;
export default docsRoutes;
