export const openapiSpec = {
  "openapi": "3.1.0",
  "info": {
    "title": "RentReady API",
    "description": "Gestion locative — API REST pour gerer vos biens, locataires, baux, paiements et maintenance. Authentification via Bearer token. Toutes les routes (sauf /api/auth/*, /api/health, /api/lead/*) requierent un header Authorization. Rate limiting: 10 req/60s sur les routes auth (Upstash Redis). Erreurs standard: 400 (donnees invalides), 401 (non autorise), 403 (acces interdit), 404 (introuvaable), 409 (conflit), 429 (rate limit), 500 (erreur interne). Pagination: toutes les routes de liste supportent page et limit.",
    "version": "1.0.0",
    "contact": {
      "name": "RentReady Support",
      "email": "support@rentready.fr"
    }
  },
  "servers": [
    {
      "url": "https://rentready.fr/api",
      "description": "Production"
    },
    {
      "url": "http://localhost:3000/api",
      "description": "Developpement local"
    }
  ],
  "tags": [
    {
      "name": "Auth",
      "description": "Authentication & session management"
    },
    {
      "name": "Properties",
      "description": "Gestion des biens immobiliers"
    },
    {
      "name": "Units",
      "description": "Lots / unites au sein d un bien"
    },
    {
      "name": "Tenants",
      "description": "Gestion des locataires"
    },
    {
      "name": "Leases",
      "description": "Baux locatifs"
    },
    {
      "name": "Payments",
      "description": "Enregistrement et suivi des paiements"
    },
    {
      "name": "Maintenance",
      "description": "Tickets de maintenance"
    },
    {
      "name": "Guarantors",
      "description": "Garants"
    },
    {
      "name": "Documents",
      "description": "Documents (bail, recu, checklist)"
    },
    {
      "name": "Dashboard",
      "description": "Resume du tableau de bord"
    },
    {
      "name": "SEO",
      "description": "Endpoints SEO (schema.org, sitemap)"
    },
    {
      "name": "AI",
      "description": "Assistants IA"
    },
    {
      "name": "Stripe",
      "description": "Integration paiement Stripe"
    },
    {
      "name": "Lead",
      "description": "Capture de leads"
    },
    {
      "name": "Misc",
      "description": "Sante, metrics, RSS, etc."
    }
  ],
  "paths": {
    "/properties": {
      "get": {
        "tags": [
          "Properties"
        ],
        "summary": "Liste des biens",
        "operationId": "listProperties",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des biens"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Properties"
        ],
        "summary": "Creer un bien",
        "operationId": "createProperty",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Bien cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/properties/{id}": {
      "get": {
        "tags": [
          "Properties"
        ],
        "summary": "Detail d un bien",
        "operationId": "getProperty",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du bien"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bien introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Properties"
        ],
        "summary": "Modifier un bien",
        "operationId": "updateProperty",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Bien mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bien introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "delete": {
        "tags": [
          "Properties"
        ],
        "summary": "Supprimer un bien (soft delete)",
        "operationId": "deleteProperty",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Bien supprime"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bien introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/units": {
      "get": {
        "tags": [
          "Units"
        ],
        "summary": "Liste des lots / unites",
        "operationId": "listUnits",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "VACANT",
                "RENTED",
                "MAINTENANCE"
              ]
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des unites"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Units"
        ],
        "summary": "Creer une unite",
        "operationId": "createUnit",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UnitCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Unite creee"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bien introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/units/{id}": {
      "get": {
        "tags": [
          "Units"
        ],
        "summary": "Detail d une unite",
        "operationId": "getUnit",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail de l unite"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Unite introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Units"
        ],
        "summary": "Modifier une unite",
        "operationId": "updateUnit",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UnitCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Unite mise a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Unite introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "delete": {
        "tags": [
          "Units"
        ],
        "summary": "Supprimer une unite",
        "operationId": "deleteUnit",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Unite supprimee"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Unite introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/tenants": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "Liste des locataires",
        "operationId": "listTenants",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des locataires"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Tenants"
        ],
        "summary": "Creer un locataire",
        "operationId": "createTenant",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Locataire cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/tenants/{id}": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "Detail d un locataire",
        "operationId": "getTenant",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du locataire"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Locataire introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Tenants"
        ],
        "summary": "Modifier un locataire",
        "operationId": "updateTenant",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Locataire mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Locataire introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/leases": {
      "get": {
        "tags": [
          "Leases"
        ],
        "summary": "Liste des baux",
        "operationId": "listLeases",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "ACTIVE",
                "TERMINATED",
                "DRAFT",
                "EXPIRED"
              ]
            }
          },
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "tenantId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des baux"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Leases"
        ],
        "summary": "Creer un bail",
        "operationId": "createLease",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LeaseCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Bail cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bien ou locataire introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/leases/{id}": {
      "get": {
        "tags": [
          "Leases"
        ],
        "summary": "Detail d un bail",
        "operationId": "getLease",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du bail"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Leases"
        ],
        "summary": "Modifier un bail",
        "operationId": "updateLease",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LeaseCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Bail mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/leases/{id}/payments": {
      "get": {
        "tags": [
          "Leases"
        ],
        "summary": "Paiements d un bail",
        "operationId": "listLeasePayments",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Paiements du bail"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/leases/{id}/revision-preview": {
      "get": {
        "tags": [
          "Leases"
        ],
        "summary": "Apercu de revision de loyer",
        "operationId": "getLeaseRevisionPreview",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Apercu de revision"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/payments": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Liste des paiements",
        "operationId": "listPayments",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "leaseId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "tenantId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "PAID",
                "PARTIAL",
                "PENDING",
                "LATE",
                "CANCELLED"
              ]
            }
          },
          {
            "name": "startDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des paiements"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Payments"
        ],
        "summary": "Enregistrer un paiement",
        "operationId": "createPayment",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PaymentCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Paiement enregistre"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/payments/{id}": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Detail d un paiement",
        "operationId": "getPayment",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du paiement"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Paiement introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Payments"
        ],
        "summary": "Modifier un paiement",
        "operationId": "updatePayment",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PaymentUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Paiement mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Paiement introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/payments/{id}/receipt": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Generer un recu de paiement",
        "operationId": "getPaymentReceipt",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recu de paiement"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Paiement introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/transactions": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Liste des transactions (alias /payments)",
        "operationId": "listTransactions",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "leaseId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "PAID",
                "PARTIAL",
                "PENDING",
                "LATE",
                "CANCELLED"
              ]
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des transactions"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/transactions/unpaid": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Loyers impayes",
        "operationId": "listUnpaidTransactions",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des impayes"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/transactions/dashboard": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Resume financier pour le tableau de bord",
        "operationId": "getTransactionsDashboard",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Resume financier"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/maintenance": {
      "get": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Liste des tickets de maintenance",
        "operationId": "listMaintenanceTickets",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "OPEN",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED"
              ]
            }
          },
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "priority",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "LOW",
                "MEDIUM",
                "HIGH",
                "URGENT"
              ]
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des tickets"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Creer un ticket de maintenance",
        "operationId": "createMaintenanceTicket",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MaintenanceTicketCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Ticket cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/maintenance/{id}": {
      "get": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Detail d un ticket de maintenance",
        "operationId": "getMaintenanceTicket",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du ticket"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Ticket introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Modifier un ticket de maintenance",
        "operationId": "updateMaintenanceTicket",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MaintenanceTicketUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ticket mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Ticket introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/guarantors": {
      "get": {
        "tags": [
          "Guarantors"
        ],
        "summary": "Liste des garants",
        "operationId": "listGuarantors",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "leaseId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des garants"
          },
          "400": {
            "description": "leaseId requis"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Guarantors"
        ],
        "summary": "Ajouter un garant",
        "operationId": "createGuarantor",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GuarantorCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Garant ajoute"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "409": {
            "description": "Un garant existe deja pour ce bail"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/guarantors/{id}": {
      "get": {
        "tags": [
          "Guarantors"
        ],
        "summary": "Detail d un garant",
        "operationId": "getGuarantor",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du garant"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Garant introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Guarantors"
        ],
        "summary": "Modifier un garant",
        "operationId": "updateGuarantor",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GuarantorCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Garant mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Garant introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/documents": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "Liste des documents",
        "operationId": "listDocuments",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "leaseId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "type",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "LEASE",
                "RECEIPT",
                "INVENTORY",
                "CHECKLIST",
                "DEPOSIT_RETURN",
                "NOTICE",
                "OTHER"
              ]
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des documents"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Documents"
        ],
        "summary": "Upload un document",
        "operationId": "uploadDocument",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary"
                  },
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "unitId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "LEASE",
                      "RECEIPT",
                      "INVENTORY",
                      "CHECKLIST",
                      "DEPOSIT_RETURN",
                      "NOTICE",
                      "OTHER"
                    ]
                  },
                  "name": {
                    "type": "string"
                  }
                },
                "required": [
                  "file",
                  "type"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Document uploade"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/documents/{documentId}": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "Detail / download d un document",
        "operationId": "getDocument",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "documentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Document"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Document introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/documents/checklist": {
      "post": {
        "tags": [
          "Documents"
        ],
        "summary": "Generer une checklist etat des lieux",
        "operationId": "generateChecklist",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "type": {
                    "type": "string",
                    "enum": [
                      "ENTRY",
                      "EXIT"
                    ]
                  }
                },
                "required": [
                  "leaseId",
                  "type"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Checklist generee"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/documents/deposit-return": {
      "post": {
        "tags": [
          "Documents"
        ],
        "summary": "Generer un bordereau de restitution de depot de garantie",
        "operationId": "generateDepositReturn",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": [
                  "leaseId"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Bordereau genere"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/charges": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Liste des charges",
        "operationId": "listCharges",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des charges"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Payments"
        ],
        "summary": "Creer une charge",
        "operationId": "createCharge",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChargeCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Charge creee"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/charges/{id}": {
      "get": {
        "tags": [
          "Payments"
        ],
        "summary": "Detail d une charge",
        "operationId": "getCharge",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail de la charge"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Charge introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Payments"
        ],
        "summary": "Modifier une charge",
        "operationId": "updateCharge",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChargeCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Charge mise a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Charge introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/dashboard/summary": {
      "get": {
        "tags": [
          "Dashboard"
        ],
        "summary": "Resume du tableau de bord",
        "operationId": "getDashboardSummary",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Resume du tableau de bord"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/blog": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Liste des articles de blog (SEO)",
        "operationId": "listSeoBlog",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des articles"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/blog/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Detail SEO d un article de blog",
        "operationId": "getSeoBlogPost",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Metadonnees SEO"
          },
          "404": {
            "description": "Article introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/faq": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Liste des FAQs SEO",
        "operationId": "listSeoFaqs",
        "responses": {
          "200": {
            "description": "Liste des FAQs"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/faq/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "FAQ SEO par slug",
        "operationId": "getSeoFaq",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "FAQ"
          },
          "404": {
            "description": "FAQ introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/faq/{slug}/schema": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Schema.org FAQPage pour une FAQ",
        "operationId": "getSeoFaqSchema",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "JSON-LD FAQPage"
          },
          "404": {
            "description": "FAQ introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/glossary": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Liste du glossaire SEO",
        "operationId": "listSeoGlossary",
        "responses": {
          "200": {
            "description": "Liste des termes"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/glossary/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Terme du glossaire SEO",
        "operationId": "getSeoGlossaryTerm",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Terme detaille"
          },
          "404": {
            "description": "Terme introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/template/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Detail SEO d un modele de document",
        "operationId": "getSeoTemplate",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du template"
          },
          "404": {
            "description": "Template introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/template/{slug}/schema": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Schema.org HowTo pour un template",
        "operationId": "getSeoTemplateSchema",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "JSON-LD HowTo"
          },
          "404": {
            "description": "Template introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/calculator/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Detail SEO d un calculateur",
        "operationId": "getSeoCalculator",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du calculateur"
          },
          "404": {
            "description": "Calculateur introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/calculator/{slug}/schema": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Schema.org WebApplication pour un calculateur",
        "operationId": "getSeoCalculatorSchema",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "JSON-LD WebApplication"
          },
          "404": {
            "description": "Calculateur introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/homepage": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Metadonnees SEO de la homepage",
        "operationId": "getSeoHomepage",
        "responses": {
          "200": {
            "description": "Metadonnees homepage"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/organization": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Schema.org Organization",
        "operationId": "getSeoOrganization",
        "responses": {
          "200": {
            "description": "JSON-LD Organization"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/seo/events": {
      "post": {
        "tags": [
          "SEO"
        ],
        "summary": "Suivi d evenements SEO",
        "operationId": "trackSeoEvent",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "event": {
                    "type": "string"
                  },
                  "page": {
                    "type": "string"
                  },
                  "metadata": {
                    "type": "object"
                  }
                },
                "required": [
                  "event",
                  "page"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Evenement enregistre"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/ai/analyze-lease": {
      "post": {
        "tags": [
          "AI"
        ],
        "summary": "Analyser un bail avec l IA",
        "operationId": "analyzeLease",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": [
                  "leaseId"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Analyse du bail"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/ai/follow-up-draft": {
      "post": {
        "tags": [
          "AI"
        ],
        "summary": "Generer un brouillon de relance",
        "operationId": "generateFollowUpDraft",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "tone": {
                    "type": "string",
                    "enum": [
                      "FRIENDLY",
                      "FORMAL",
                      "FINAL"
                    ]
                  }
                },
                "required": [
                  "leaseId"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Brouillon genere"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/ai/maintenance-summarize": {
      "post": {
        "tags": [
          "AI"
        ],
        "summary": "Resumer un ticket de maintenance",
        "operationId": "summarizeMaintenanceTicket",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "ticketId": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": [
                  "ticketId"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Resume genere"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Ticket introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/ai/owner-summary": {
      "post": {
        "tags": [
          "AI"
        ],
        "summary": "Generer un resume proprietaire",
        "operationId": "generateOwnerSummary",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Resume proprietaire"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/stripe/checkout": {
      "post": {
        "tags": [
          "Stripe"
        ],
        "summary": "Creer une session de paiement Stripe",
        "operationId": "createStripeCheckout",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "leaseId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "amount": {
                    "type": "number"
                  }
                },
                "required": [
                  "leaseId"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Session Stripe creee"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Bail introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/stripe/portal": {
      "post": {
        "tags": [
          "Stripe"
        ],
        "summary": "Creer un portal Stripe",
        "operationId": "createStripePortal",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "URL du portal Stripe"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/stripe/plans": {
      "get": {
        "tags": [
          "Stripe"
        ],
        "summary": "Liste des plans tarifaires",
        "operationId": "listStripePlans",
        "responses": {
          "200": {
            "description": "Plans tarifaires"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/lead/demo": {
      "post": {
        "tags": [
          "Lead"
        ],
        "summary": "Demande de demonstration",
        "operationId": "requestDemo",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string",
                    "format": "email"
                  },
                  "phone": {
                    "type": "string"
                  },
                  "company": {
                    "type": "string"
                  }
                },
                "required": [
                  "email"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Demande enregistree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/glossary": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Liste des termes du glossaire",
        "operationId": "listGlossary",
        "responses": {
          "200": {
            "description": "Liste des termes"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/glossary/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Terme du glossaire detaille",
        "operationId": "getGlossaryTerm",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Terme detaille"
          },
          "404": {
            "description": "Terme introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/property-types": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Liste des types de biens",
        "operationId": "listPropertyTypes",
        "responses": {
          "200": {
            "description": "Liste des types de biens"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/property-types/{slug}": {
      "get": {
        "tags": [
          "SEO"
        ],
        "summary": "Guide d un type de bien",
        "operationId": "getPropertyType",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Guide du type de bien"
          },
          "404": {
            "description": "Type introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/reminders": {
      "get": {
        "tags": [
          "Misc"
        ],
        "summary": "Liste des rappels",
        "operationId": "listReminders",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "propertyId",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "status",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "PENDING",
                "SENT",
                "CANCELLED"
              ]
            }
          },
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Liste des rappels"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Misc"
        ],
        "summary": "Creer un rappel",
        "operationId": "createReminder",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ReminderCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Rappel cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/reminders/{id}": {
      "get": {
        "tags": [
          "Misc"
        ],
        "summary": "Detail d un rappel",
        "operationId": "getReminder",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Detail du rappel"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Rappel introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "patch": {
        "tags": [
          "Misc"
        ],
        "summary": "Modifier un rappel",
        "operationId": "updateReminder",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ReminderCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Rappel mis a jour"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Rappel introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/reminders/send": {
      "post": {
        "tags": [
          "Misc"
        ],
        "summary": "Envoyer un rappel",
        "operationId": "sendReminder",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "reminderId": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": [
                  "reminderId"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Rappel envoye"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Rappel introuvable"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/health": {
      "get": {
        "tags": [
          "Misc"
        ],
        "summary": "Health check",
        "operationId": "healthCheck",
        "responses": {
          "200": {
            "description": "Service operationnelle"
          },
          "500": {
            "description": "Service indisponible"
          }
        }
      }
    },
    "/metrics": {
      "get": {
        "tags": [
          "Misc"
        ],
        "summary": "Metriques Prometheus",
        "operationId": "getMetrics",
        "responses": {
          "200": {
            "description": "Metriques Prometheus"
          }
        }
      }
    },
    "/rss": {
      "get": {
        "tags": [
          "Misc"
        ],
        "summary": "Flux RSS du blog",
        "operationId": "getRssFeed",
        "responses": {
          "200": {
            "description": "Flux RSS"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/analytics/page-view": {
      "post": {
        "tags": [
          "Misc"
        ],
        "summary": "Track une vue de page",
        "operationId": "trackPageView",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "url": {
                    "type": "string"
                  },
                  "referrer": {
                    "type": "string"
                  }
                },
                "required": [
                  "url"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Vue enregistree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/tenant/lease": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "Bail du locataire connecte",
        "operationId": "getTenantLease",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Bail du locataire"
          },
          "401": {
            "description": "Non autorise"
          },
          "404": {
            "description": "Aucun bail trouve"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/tenant/quittances": {
      "get": {
        "tags": [
          "Tenants"
        ],
        "summary": "Quittances du locataire connecte",
        "operationId": "getTenantQuittances",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Quittances"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    },
    "/tenant/maintenance": {
      "get": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Tickets du locataire connecte",
        "operationId": "getTenantMaintenance",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 50,
              "maximum": 100
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Tickets du locataire"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      },
      "post": {
        "tags": [
          "Maintenance"
        ],
        "summary": "Creer un ticket (locataire)",
        "operationId": "createTenantMaintenanceTicket",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MaintenanceTicketCreate"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Ticket cree"
          },
          "400": {
            "description": "Donnees invalides"
          },
          "401": {
            "description": "Non autorise"
          },
          "500": {
            "description": "Erreur interne"
          }
        }
      }
    }
  },

    // ---- Missing from spec — added by REN-570 ----

    "/auth/{path}": {
      "get": {
        "tags": ["Auth"],
        "summary": "Auth proxy (BETTER auth routes)",
        "operationId": "authGet",
        "description": "Proxy to Better Auth handlers. Supports magic-link, email/password, session management. Route: /api/auth/signin, /api/auth/session, etc.",
        "parameters": [{
          "name": "path",
          "in": "path",
          "required": true,
          "schema": { "type": "string" }
        }],
        "responses": {
          "200": { "description": "Auth response" },
          "401": { "description": "Non autorisé" }
        }
      },
      "post": {
        "tags": ["Auth"],
        "summary": "Auth action (sign-in, sign-up, sign-out, reset...)",
        "operationId": "authPost",
        "description": "POST actions: email+password sign-in, magic link request, sign-out, password reset, oAuth callbacks.",
        "parameters": [{
          "name": "path",
          "in": "path",
          "required": true,
          "schema": { "type": "string" }
        }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "type": "object", "additionalProperties": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Auth action response" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "429": { "description": "Rate limit" }
        }
      }
    },

    "/transactions": {
      "get": {
        "tags": ["Transactions"],
        "summary": "Liste des transactions",
        "operationId": "listTransactions",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 50, "maximum": 100 } },
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["PAID", "PARTIAL", "PENDING", "LATE", "CANCELLED"] } },
          { "name": "leaseId", "in": "query", "schema": { "type": "string", "format": "uuid" } },
          { "name": "startDate", "in": "query", "schema": { "type": "string", "format": "date" } },
          { "name": "endDate", "in": "query", "schema": { "type": "string", "format": "date" } }
        ],
        "responses": {
          "200": { "description": "Liste des transactions" },
          "401": { "description": "Non autorisé" },
          "500": { "description": "Erreur interne" }
        }
      },
      "post": {
        "tags": ["Transactions"],
        "summary": "Enregistrer un paiement (transaction)",
        "operationId": "createTransaction",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/TransactionCreate" }
            }
          }
        },
        "responses": {
          "201": { "description": "Transaction créée" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Bail introuvable" },
          "429": { "description": "Rate limit (30/h)" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/transactions/{id}": {
      "get": {
        "tags": ["Transactions"],
        "summary": "Detail d'une transaction",
        "operationId": "getTransaction",
        "security": [{ "bearerAuth": [] }],
        "parameters": [{
          "name": "id", "in": "path", "required": true,
          "schema": { "type": "string", "format": "uuid" }
        }],
        "responses": {
          "200": { "description": "Détail de la transaction" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      },
      "patch": {
        "tags": ["Transactions"],
        "summary": "Modifier une transaction",
        "operationId": "updateTransaction",
        "security": [{ "bearerAuth": [] }],
        "parameters": [{
          "name": "id", "in": "path", "required": true,
          "schema": { "type": "string", "format": "uuid" }
        }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/TransactionUpdate" }
            }
          }
        },
        "responses": {
          "200": { "description": "Transaction mise à jour" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      },
      "delete": {
        "tags": ["Transactions"],
        "summary": "Supprimer une transaction",
        "operationId": "deleteTransaction",
        "security": [{ "bearerAuth": [] }],
        "parameters": [{
          "name": "id", "in": "path", "required": true,
          "schema": { "type": "string", "format": "uuid" }
        }],
        "responses": {
          "200": { "description": "Transaction supprimée" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/transactions/{id}/receipt": {
      "get": {
        "tags": ["Transactions"],
        "summary": "Obtenir un reçu JSON pour une transaction",
        "operationId": "getTransactionReceipt",
        "security": [{ "bearerAuth": [] }],
        "parameters": [{
          "name": "id", "in": "path", "required": true,
          "schema": { "type": "string", "format": "uuid" }
        }],
        "responses": {
          "200": { "description": "Reçu JSON" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      },
      "post": {
        "tags": ["Transactions"],
        "summary": "Générer un PDF quittance pour une transaction",
        "operationId": "generateTransactionReceiptPdf",
        "description": "Produit un PDF de quittance via react-pdf et le retourne en binary. Content-Type: application/pdf.",
        "security": [{ "bearerAuth": [] }],
        "parameters": [{
          "name": "id", "in": "path", "required": true,
          "schema": { "type": "string", "format": "uuid" }
        }],
        "responses": {
          "200": { "description": "PDF quittance (application/pdf)", "content": { "application/pdf": { "schema": { "type": "string", "format": "binary" } } } },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/send-welcome": {
      "post": {
        "tags": ["Email"],
        "summary": "Envoyer l'email de bienvenue",
        "operationId": "sendWelcomeEmail",
        "description": "Déclenché par le frontend après la première connexion. Nécessite une session valide. Utilise le template welcome.html.",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Email envoyé" },
          "401": { "description": "Non autorisé" },
          "429": { "description": "Rate limit" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/send-rent-reminder": {
      "post": {
        "tags": ["Email"],
        "summary": "Envoyer un rappel de loyer",
        "operationId": "sendRentReminder",
        "description": "Envoie un email de relance de loyer impayé. Utilise le template rent-reminder.html.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["transactionId"],
                "properties": {
                  "transactionId": { "type": "string", "format": "uuid" },
                  "tone": { "type": "string", "enum": ["friendly", "formal", "legal"], "default": "friendly" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Email envoyé" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "429": { "description": "Rate limit" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/send-tenant-invitation": {
      "post": {
        "tags": ["Email"],
        "summary": "Envoyer une invitation locataire",
        "operationId": "sendTenantInvitation",
        "description": "Envoie un email d'invitation au portail locataire. Le locataire peut accepter ou refuser.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["tenantId"],
                "properties": {
                  "tenantId": { "type": "string", "format": "uuid" },
                  "email": { "type": "string", "format": "email" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Invitation envoyée" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Locataire introuvable" },
          "429": { "description": "Rate limit" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/send-password-reset": {
      "post": {
        "tags": ["Email"],
        "summary": "Envoyer un email de réinitialisation de mot de passe",
        "operationId": "sendPasswordReset",
        "description": "Envoie un email avec un lien de reset de mot de passe. Langue détectée depuis le header Accept-Language.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email"],
                "properties": { "email": { "type": "string", "format": "email" } }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Email envoyé si l'adresse existe" },
          "400": { "description": "Données invalides" },
          "429": { "description": "Rate limit" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/send-lease-expiry": {
      "post": {
        "tags": ["Email"],
        "summary": "Envoyer un email d'expiration de bail",
        "operationId": "sendLeaseExpiry",
        "description": "Notifie le propriétaire qu'un bail approche de son expiration (30 jours avant).",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leaseId"],
                "properties": {
                  "leaseId": { "type": "string", "format": "uuid" },
                  "daysNotice": { "type": "integer", "default": 30 }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Email envoyé" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Bail introuvable" },
          "429": { "description": "Rate limit" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/email/cron-dispatch": {
      "post": {
        "tags": ["Email"],
        "summary": "Dispatch automatique des emails batch (cron)",
        "operationId": "cronDispatch",
        "description": "Route de cron pour envoyer les emails en lot (rappels de loyer, expirations de bail). Sécurisée par X-Cron-Secret.",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Emails dispatchés" },
          "401": { "description": "Non autorisé" },
          "403": { "description": "Secret cron manquant" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/reminders/letter": {
      "get": {
        "tags": ["Reminders"],
        "summary": "Générer un PDF de lettre de relance",
        "operationId": "getReminderLetterPdf",
        "description": "Produit un PDF de lettre de relance de loyer avec IA (ton Friendly / Formal / Legal). Inclut les coordonnées bailleur, locataire, et le détail de l'impayé.",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "transactionId", "in": "query", "required": true, "schema": { "type": "string", "format": "uuid" } },
          { "name": "tone", "in": "query", "schema": { "type": "string", "enum": ["friendly", "formal", "legal"], "default": "friendly" } }
        ],
        "responses": {
          "200": { "description": "PDF lettre (application/pdf)", "content": { "application/pdf": { "schema": { "type": "string", "format": "binary" } } } },
          "401": { "description": "Non autorisé" },
          "404": { "description": "Transaction introuvable" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/cron/revision-check": {
      "get": {
        "tags": ["Cron"],
        "summary": "Vérifier les révisions de loyer (IRL) à venir",
        "operationId": "revisionCheck",
        "description": "Cron quotidien — vérifie les baux approchant leur date de révision IRL et notifie les propriétaires 30 jours à l'avance. Sécurisé par X-Cron-Secret.",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "daysAhead", "in": "query", "schema": { "type": "integer", "default": 30 } }
        ],
        "responses": {
          "200": { "description": "Résultat du check" },
          "401": { "description": "Non autorisé" },
          "403": { "description": "Secret cron manquant" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/webhooks/stripe": {
      "post": {
        "tags": ["Webhooks"],
        "summary": "Webhook Stripe",
        "operationId": "stripeWebhook",
        "description": "Reçoit les événements Stripe (checkout.session.completed, customer.subscription.updated, etc.). Vérifie la signature Stripe.",
        "parameters": [{
          "name": "stripe-signature",
          "in": "header",
          "required": true,
          "schema": { "type": "string" }
        }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "type": "object", "additionalProperties": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Événement traité" },
          "400": { "description": "Signature ou payload invalide" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/webhooks/bank": {
      "post": {
        "tags": ["Webhooks"],
        "summary": "Webhook banque (parser les notifications de virement)",
        "operationId": "bankWebhook",
        "description": "Reçoit les webhooks des banques FR (virements SEPA). Parse le format CAMT.053 et crée des transactions automatiquement.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "type": "object", "additionalProperties": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Webhook traité" },
          "400": { "description": "Payload invalide" },
          "401": { "description": "Non autorisé" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/e-reporting/export": {
      "post": {
        "tags": ["E-Reporting"],
        "summary": "Exporter les données pour la déclaration 2072 (SCI)",
        "operationId": "exportReporting",
        "description": "Génère un fichier d'export compatible avec les logiciels de déclaration 2072 (sci.fr,个人所得税). Inclut les revenus locatifs, charges, et soldes par propriété.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["year"],
                "properties": {
                  "year": { "type": "integer", "description": "Année fiscale (ex: 2025)" },
                  "propertyIds": { "type": "array", "items": { "type": "string", "format": "uuid" } },
                  "format": { "type": "string", "enum": ["json", "csv"], "default": "json" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Export généré" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/fiscal/prepare": {
      "post": {
        "tags": ["Fiscal"],
        "summary": "Préparer les données fiscales",
        "operationId": "prepareFiscalData",
        "description": "Prépare un résumé fiscal pour un utilisateur (revenus locatifs, charges déductibles, résultat net). Utilisé par les partenaires comptables.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["year"],
                "properties": {
                  "year": { "type": "integer" },
                  "regime": { "type": "string", "enum": ["micro", "reel"], "default": "micro" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Données fiscales préparées" },
          "400": { "description": "Données invalides" },
          "401": { "description": "Non autorisé" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/og": {
      "get": {
        "tags": ["OG"],
        "summary": "Générer une image OG dynamique",
        "operationId": "getOgImage",
        "description": "Génère une image Open Graph dynamique (1200x630) via Satori/Resvg. Utilisée pour le partage social.",
        "parameters": [
          { "name": "title", "in": "query", "schema": { "type": "string" } },
          { "name": "description", "in": "query", "schema": { "type": "string" } },
          { "name": "type", "in": "query", "schema": { "type": "string", "enum": ["tool", "template", "blog", "home"] } }
        ],
        "responses": {
          "200": { "description": "Image PNG (image/png)", "content": { "image/png": { "schema": { "type": "string", "format": "binary" } } } },
          "400": { "description": "Paramètres invalides" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/onboarding/track": {
      "post": {
        "tags": ["Onboarding"],
        "summary": "Suivre les étapes d'onboarding",
        "operationId": "trackOnboarding",
        "description": "Enregistre les étapes d'onboarding (first_property, first_tenant, first_lease, first_payment). Pour analytics et email nurture.",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["step"],
                "properties": {
                  "step": { "type": "string", "enum": ["first_property", "first_tenant", "first_lease", "first_payment", "completed"] }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Étape enregistrée" },
          "400": { "description": "Étape invalide" },
          "401": { "description": "Non autorisé" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/seo/tools/{slug}": {
      "get": {
        "tags": ["SEO"],
        "summary": "Données SEO pour une page outil",
        "operationId": "getSeoTool",
        "description": "Retourne le contenu structuré (title, description, HowTo steps, FAQ) pour une page outil. Slugs: calculateur-irl-2026, calculateur-depot-garantie, lettre-relance-loyer, etc.",
        "parameters": [{
          "name": "slug", "in": "path", "required": true,
          "schema": { "type": "string" }
        }],
        "responses": {
          "200": { "description": "Données SEO de l'outil" },
          "404": { "description": "Outil introuvable" },
          "500": { "description": "Erreur interne" }
        }
      }
    },

    "/api-docs": {
      "get": {
        "tags": ["Docs"],
        "summary": "Documentation interactive de l'API (Scalar)",
        "operationId": "getApiDocs",
        "description": "Page HTML interactive générée par Scalar API Reference. Affiche la documentation complète de l'API avec Try-It-Out.",
        "responses": {
          "200": { "description": "Page HTML (text/html)" }
        }
      }
    },

    "/openapi.json": {
      "get": {
        "tags": ["Docs"],
        "summary": "Spécification OpenAPI 3.1 en JSON",
        "operationId": "getOpenApiSpec",
        "description": "Retourne le document OpenAPI 3.1 complet au format JSON. Cache: public, max-age=3600.",
        "responses": {
          "200": {
            "description": "Document OpenAPI 3.1",
            "content": {
              "application/json": {
                "schema": { "type": "object", "additionalProperties": true }
              }
            }
          }
        }
      }
    },

  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Jeton de session obtenu via POST /api/auth/sign-in"
      }
    },
    "schemas": {
      "Pagination": {
        "type": "object",
        "properties": {
          "page": {
            "type": "integer",
            "example": 1
          },
          "limit": {
            "type": "integer",
            "example": 50
          },
          "total": {
            "type": "integer",
            "example": 200
          },
          "pages": {
            "type": "integer",
            "example": 4
          }
        }
      },
      "Property": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "example": "Studio Madeleine"
          },
          "type": {
            "type": "string",
            "enum": [
              "APARTMENT",
              "HOUSE",
              "STUDIO",
              "COMMERCIAL",
              "PARKIG",
              "OTHER"
            ]
          },
          "addressLine1": {
            "type": "string"
          },
          "addressLine2": {
            "type": "string",
            "nullable": true
          },
          "city": {
            "type": "string",
            "example": "Paris"
          },
          "postalCode": {
            "type": "string",
            "example": "75008"
          },
          "surface": {
            "type": "number",
            "nullable": true,
            "example": 45.5
          },
          "rooms": {
            "type": "integer",
            "nullable": true,
            "example": 2
          },
          "description": {
            "type": "string",
            "nullable": true
          },
          "cadastralRef": {
            "type": "string",
            "nullable": true
          },
          "taxRef": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          },
          "_count": {
            "type": "object",
            "properties": {
              "leases": {
                "type": "integer"
              },
              "units": {
                "type": "integer"
              }
            }
          }
        }
      },
      "PropertyCreate": {
        "type": "object",
        "required": [
          "name",
          "type",
          "addressLine1",
          "city",
          "postalCode"
        ],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "type": {
            "type": "string",
            "enum": [
              "APARTMENT",
              "HOUSE",
              "STUDIO",
              "COMMERCIAL",
              "PARKING",
              "OTHER"
            ]
          },
          "addressLine1": {
            "type": "string",
            "minLength": 1,
            "maxLength": 500
          },
          "addressLine2": {
            "type": "string",
            "maxLength": 500
          },
          "city": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "postalCode": {
            "type": "string",
            "minLength": 5,
            "maxLength": 10
          },
          "surface": {
            "type": "number"
          },
          "rooms": {
            "type": "integer"
          },
          "description": {
            "type": "string",
            "maxLength": 2000
          },
          "cadastralRef": {
            "type": "string",
            "maxLength": 50
          },
          "taxRef": {
            "type": "string",
            "maxLength": 50
          }
        }
      },
      "Unit": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "floor": {
            "type": "integer",
            "nullable": true
          },
          "unitNumber": {
            "type": "string",
            "nullable": true
          },
          "surface": {
            "type": "number",
            "nullable": true
          },
          "rooms": {
            "type": "integer",
            "nullable": true
          },
          "type": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "VACANT",
              "RENTED",
              "MAINTENANCE"
            ]
          },
          "property": {
            "type": "object",
            "properties": {
              "id": true,
              "name": true,
              "city": true
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "UnitCreate": {
        "type": "object",
        "required": [
          "propertyId",
          "name",
          "type",
          "status"
        ],
        "properties": {
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "floor": {
            "type": "integer"
          },
          "unitNumber": {
            "type": "string"
          },
          "surface": {
            "type": "number"
          },
          "rooms": {
            "type": "integer"
          },
          "type": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "VACANT",
              "RENTED",
              "MAINTENANCE"
            ]
          }
        }
      },
      "Tenant": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email",
            "nullable": true
          },
          "phone": {
            "type": "string",
            "nullable": true
          },
          "addressLine1": {
            "type": "string"
          },
          "addressLine2": {
            "type": "string",
            "nullable": true
          },
          "city": {
            "type": "string"
          },
          "postalCode": {
            "type": "string"
          },
          "dateOfBirth": {
            "type": "string",
            "nullable": true
          },
          "placeOfBirth": {
            "type": "string",
            "nullable": true
          },
          "emergencyName": {
            "type": "string",
            "nullable": true
          },
          "emergencyPhone": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "_count": {
            "type": "object",
            "properties": {
              "leases": {
                "type": "integer"
              }
            }
          }
        }
      },
      "TenantCreate": {
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "addressLine1",
          "city",
          "postalCode"
        ],
        "properties": {
          "firstName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "lastName": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "phone": {
            "type": "string",
            "maxLength": 20
          },
          "addressLine1": {
            "type": "string",
            "minLength": 1,
            "maxLength": 500
          },
          "addressLine2": {
            "type": "string",
            "maxLength": 500
          },
          "city": {
            "type": "string",
            "minLength": 1,
            "maxLength": 200
          },
          "postalCode": {
            "type": "string",
            "minLength": 5,
            "maxLength": 10
          },
          "dateOfBirth": {
            "type": "string"
          },
          "placeOfBirth": {
            "type": "string",
            "maxLength": 200
          },
          "emergencyName": {
            "type": "string",
            "maxLength": 200
          },
          "emergencyPhone": {
            "type": "string",
            "maxLength": 20
          }
        }
      },
      "Lease": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "rentAmount": {
            "type": "number"
          },
          "chargesAmount": {
            "type": "number"
          },
          "depositAmount": {
            "type": "number"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date",
            "nullable": true
          },
          "paymentDay": {
            "type": "integer"
          },
          "paymentMethod": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "CHECK",
              "CASH",
              "DIRECT_DEBIT",
              "OTHER"
            ]
          },
          "leaseType": {
            "type": "string",
            "enum": [
              "UNFURNISHED",
              "FURNISHED",
              "COMMERCIAL",
              "SEASONAL"
            ]
          },
          "status": {
            "type": "string",
            "enum": [
              "ACTIVE",
              "TERMINATED",
              "DRAFT",
              "EXPIRED"
            ]
          },
          "irlReferenceQuarter": {
            "type": "string",
            "nullable": true
          },
          "irlReferenceValue": {
            "type": "number",
            "nullable": true
          },
          "documentUrl": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "property": {
            "type": "object",
            "properties": {
              "id": true,
              "name": true,
              "addressLine1": true,
              "city": true
            }
          },
          "tenant": {
            "type": "object",
            "properties": {
              "id": true,
              "firstName": true,
              "lastName": true,
              "email": true
            }
          },
          "transactions": {
            "type": "array",
            "items": {
              "type": "object"
            }
          }
        }
      },
      "LeaseCreate": {
        "type": "object",
        "required": [
          "propertyId",
          "tenantId",
          "rentAmount",
          "chargesAmount",
          "depositAmount",
          "startDate"
        ],
        "properties": {
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "tenantId": {
            "type": "string",
            "format": "uuid"
          },
          "rentAmount": {
            "type": "number"
          },
          "chargesAmount": {
            "type": "number"
          },
          "depositAmount": {
            "type": "number"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          },
          "paymentDay": {
            "type": "integer",
            "minimum": 1,
            "maximum": 31,
            "default": 1
          },
          "paymentMethod": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "CHECK",
              "CASH",
              "DIRECT_DEBIT",
              "OTHER"
            ],
            "default": "TRANSFER"
          },
          "leaseType": {
            "type": "string",
            "enum": [
              "UNFURNISHED",
              "FURNISHED",
              "COMMERCIAL",
              "SEASONAL"
            ],
            "default": "UNFURNISHED"
          },
          "irlReferenceQuarter": {
            "type": "string"
          },
          "irlReferenceValue": {
            "type": "number"
          }
        }
      },
      "Payment": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "leaseId": {
            "type": "string",
            "format": "uuid"
          },
          "amount": {
            "type": "number"
          },
          "rentPortion": {
            "type": "number"
          },
          "chargesPortion": {
            "type": "number"
          },
          "periodStart": {
            "type": "string",
            "format": "date"
          },
          "periodEnd": {
            "type": "string",
            "format": "date"
          },
          "dueDate": {
            "type": "string",
            "format": "date"
          },
          "paidAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "paymentMethod": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "CHECK",
              "CASH",
              "DIRECT_DEBIT",
              "OTHER"
            ],
            "nullable": true
          },
          "status": {
            "type": "string",
            "enum": [
              "PAID",
              "PARTIAL",
              "PENDING",
              "LATE",
              "CANCELLED"
            ]
          },
          "isFullPayment": {
            "type": "boolean"
          },
          "receiptType": {
            "type": "string",
            "enum": [
              "FULL",
              "PARTIAL",
              "OVERPAYMENT",
              "UNDERPAYMENT"
            ],
            "nullable": true
          },
          "notes": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "lease": {
            "type": "object",
            "properties": {
              "id": true,
              "rentAmount": true,
              "chargesAmount": true
            }
          }
        }
      },
      "PaymentCreate": {
        "type": "object",
        "required": [
          "leaseId",
          "amount",
          "periodStart",
          "periodEnd",
          "dueDate"
        ],
        "properties": {
          "leaseId": {
            "type": "string",
            "format": "uuid"
          },
          "amount": {
            "type": "number"
          },
          "periodStart": {
            "type": "string",
            "format": "date"
          },
          "periodEnd": {
            "type": "string",
            "format": "date"
          },
          "dueDate": {
            "type": "string",
            "format": "date"
          },
          "paidAt": {
            "type": "string",
            "format": "date-time"
          },
          "paymentMethod": {
            "type": "string",
            "enum": [
              "TRANSFER",
              "CHECK",
              "CASH",
              "DIRECT_DEBIT",
              "OTHER"
            ]
          },
          "notes": {
            "type": "string",
            "maxLength": 1000
          }
        }
      },
      "PaymentUpdate": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "PAID",
              "PARTIAL",
              "PENDING",
              "LATE",
              "CANCELLED"
            ]
          },
          "paidAt": {
            "type": "string",
            "format": "date-time"
          },
          "notes": {
            "type": "string",
            "maxLength": 1000
          }
        }
      },
      "PaymentSummary": {
        "type": "object",
        "properties": {
          "collected": {
            "type": "number"
          },
          "collectedCount": {
            "type": "integer"
          },
          "pending": {
            "type": "number"
          },
          "pendingCount": {
            "type": "integer"
          },
          "overdue": {
            "type": "number"
          },
          "overdueCount": {
            "type": "integer"
          },
          "currency": {
            "type": "string",
            "example": "EUR"
          }
        }
      },
      "MaintenanceTicket": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "unitId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "tenantId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": [
              "OPEN",
              "IN_PROGRESS",
              "RESOLVED",
              "CLOSED"
            ]
          },
          "priority": {
            "type": "string",
            "enum": [
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT"
            ],
            "nullable": true
          },
          "category": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          },
          "tenant": {
            "type": "object",
            "properties": {
              "id": true,
              "firstName": true,
              "lastName": true
            }
          },
          "property": {
            "type": "object",
            "properties": {
              "id": true,
              "name": true,
              "addressLine1": true,
              "city": true
            }
          },
          "unit": {
            "type": "object",
            "properties": {
              "id": true,
              "name": true
            },
            "nullable": true
          },
          "attachments": {
            "type": "array",
            "items": {
              "type": "object"
            }
          }
        }
      },
      "MaintenanceTicketCreate": {
        "type": "object",
        "required": [
          "title",
          "description"
        ],
        "properties": {
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "unitId": {
            "type": "string",
            "format": "uuid"
          },
          "title": {
            "type": "string",
            "maxLength": 200
          },
          "description": {
            "type": "string",
            "maxLength": 2000
          },
          "priority": {
            "type": "string",
            "enum": [
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT"
            ]
          },
          "category": {
            "type": "string"
          }
        }
      },
      "MaintenanceTicketUpdate": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "OPEN",
              "IN_PROGRESS",
              "RESOLVED",
              "CLOSED"
            ]
          },
          "priority": {
            "type": "string",
            "enum": [
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT"
            ]
          },
          "title": {
            "type": "string",
            "maxLength": 200
          },
          "description": {
            "type": "string",
            "maxLength": 2000
          }
        }
      },
      "GuarantorCreate": {
        "type": "object",
        "required": [
          "leaseId",
          "email",
          "type",
          "addressLine1",
          "city",
          "postalCode",
          "status"
        ],
        "properties": {
          "leaseId": {
            "type": "string",
            "format": "uuid"
          },
          "type": {
            "type": "string",
            "enum": [
              "PHYSICAL",
              "LEGAL"
            ]
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "dateOfBirth": {
            "type": "string",
            "format": "date"
          },
          "placeOfBirth": {
            "type": "string"
          },
          "companyName": {
            "type": "string"
          },
          "siren": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "phone": {
            "type": "string"
          },
          "addressLine1": {
            "type": "string"
          },
          "addressLine2": {
            "type": "string"
          },
          "city": {
            "type": "string"
          },
          "postalCode": {
            "type": "string"
          },
          "country": {
            "type": "string",
            "default": "France"
          },
          "financialDocumentIds": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid"
            }
          },
          "status": {
            "type": "string",
            "enum": [
              "PENDING",
              "VALIDATED",
              "REJECTED",
              "EXPIRED"
            ]
          }
        }
      },
      "TransactionCreate": {
        "type": "object",
        "required": ["amount", "type", "leaseId"],
        "properties": {
          "leaseId": { "type": "string", "format": "uuid" },
          "amount": { "type": "number", "description": "Montant en euros" },
          "type": {
            "type": "string",
            "enum": ["RENT", "CHARGE", "DEPOSIT", "REFUND", "ADJUSTMENT"]
          },
          "category": {
            "type": "string",
            "enum": ["RENT", "CHARGE", "INSURANCE", "TAX", "REPAIR", "MANAGEMENT_FEE", "OTHER"]
          },
          "dueDate": { "type": "string", "format": "date" },
          "paidAt": { "type": "string", "format": "date-time" },
          "status": {
            "type": "string",
            "enum": ["PENDING", "PARTIAL", "PAID", "LATE", "CANCELLED"],
            "default": "PENDING"
          },
          "method": {
            "type": "string",
            "enum": ["BANK_TRANSFER", "CARD", "CASH", "CHECK", "OTHER"]
          },
          "reference": { "type": "string", "description": "Référence du virement (CAMT.053)" },
          "note": { "type": "string" }
        }
      },
      "TransactionUpdate": {
        "type": "object",
        "properties": {
          "amount": { "type": "number" },
          "dueDate": { "type": "string", "format": "date" },
          "paidAt": { "type": "string", "format": "date-time" },
          "status": {
            "type": "string",
            "enum": ["PENDING", "PARTIAL", "PAID", "LATE", "CANCELLED"]
          },
          "method": {
            "type": "string",
            "enum": ["BANK_TRANSFER", "CARD", "CASH", "CHECK", "OTHER"]
          },
          "reference": { "type": "string" },
          "note": { "type": "string" }
        }
      },
      "ChargeCreate": {
        "type": "object",
        "required": [
          "propertyId",
          "label",
          "amount",
          "type"
        ],
        "properties": {
          "propertyId": {
            "type": "string",
            "format": "uuid"
          },
          "label": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          },
          "type": {
            "type": "string",
            "enum": [
              "PROVISION",
              "REGULARIZATION",
              "INVOICE"
            ]
          },
          "frequency": {
            "type": "string",
            "enum": [
              "MONTHLY",
              "QUARTERLY",
              "ANNUAL",
              "ONE_TIME"
            ]
          },
          "periodStart": {
            "type": "string",
            "format": "date"
          },
          "periodEnd": {
            "type": "string",
            "format": "date"
          },
          "isDeductible": {
            "type": "boolean",
            "default": true
          }
        }
      },
      "ReminderCreate": {
        "type": "object",
        "required": [
          "type",
          "leaseId",
          "scheduledAt"
        ],
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "RENT",
              "INSURANCE",
              "MAINTENANCE",
              "INSPECTION",
              "LEASE_RENEWAL",
              "OTHER"
            ]
          },
          "leaseId": {
            "type": "string",
            "format": "uuid"
          },
          "scheduledAt": {
            "type": "string",
            "format": "date-time"
          },
          "subject": {
            "type": "string"
          },
          "body": {
            "type": "string"
          },
          "sendToTenant": {
            "type": "boolean",
            "default": false
          },
          "sendToOwner": {
            "type": "boolean",
            "default": true
          }
        }
      }
    }
  }
} as const;