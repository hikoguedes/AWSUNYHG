export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'UNYCO CRM API',
    description: `API do sistema UNYCO CRM. Inclui endpoints de CRM (planos, usuários, assinaturas, sincronização TOTVS), Landing Page (hotéis, reservas, pagamentos Vindi), WhatsApp e Central de APIs.\n\n**Exportar para Postman:** Acesse \`/api/docs/openapi.json\` e importe o arquivo no Postman via *Import → Link ou Raw Text*.`,
    version: '1.0.0',
    contact: { name: 'UNYCO', url: 'https://unycoclub.com.br' }
  },
  servers: [{ url: '/api', description: 'API Server' }],
  tags: [
    { name: 'Health', description: 'Status e saúde do sistema' },
    { name: 'Planos', description: 'Gestão de planos de assinatura' },
    { name: 'Usuários', description: 'Gestão de usuários/cadastros' },
    { name: 'Assinaturas', description: 'Gestão de assinaturas' },
    { name: 'Sincronização', description: 'Serviço de sincronização TOTVS' },
    { name: 'TOTVS', description: 'Integração direta com TOTVS' },
    { name: 'Configurações', description: 'Configurações do sistema' },
    { name: 'LP - Auth', description: 'Autenticação da Landing Page' },
    { name: 'LP - Hotéis', description: 'Busca e informações de hotéis' },
    { name: 'LP - Reservas', description: 'Criação e gestão de reservas' },
    { name: 'LP - Pagamentos', description: 'Pagamentos via Vindi' },
    { name: 'LP - Preços', description: 'Tarifas, temporadas e preços de mercado' },
    { name: 'WhatsApp', description: 'Automação e fluxos WhatsApp' },
    { name: 'Admin', description: 'Endpoints administrativos' },
    { name: 'Central de APIs', description: 'Monitoramento e configuração de APIs externas' }
  ],
  paths: {

    // ===== HEALTH =====
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Status do servidor e banco de dados',
        responses: {
          200: { description: 'Servidor online', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' }, timestamp: { type: 'string' } } } } } },
          503: { description: 'Banco de dados offline' }
        }
      }
    },

    // ===== PLANOS =====
    '/plans.php': {
      get: {
        tags: ['Planos'],
        summary: 'Listar planos',
        parameters: [
          { name: 'id', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por ID' },
          { name: 'name', in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome' },
          { name: 'active', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por status ativo' }
        ],
        responses: {
          200: { description: 'Lista de planos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Plan' } } } } }
        }
      },
      post: {
        tags: ['Planos'],
        summary: 'Criar ou atualizar plano',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlanInput' }
            }
          }
        },
        responses: {
          200: { description: 'Plano criado/atualizado' },
          400: { description: 'Dados inválidos' }
        }
      }
    },

    // ===== USUÁRIOS =====
    '/users.php': {
      get: {
        tags: ['Usuários'],
        summary: 'Listar usuários/cadastros',
        parameters: [
          { name: 'id', in: 'query', schema: { type: 'integer' } },
          { name: 'cpf', in: 'query', schema: { type: 'string' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'email', in: 'query', schema: { type: 'string' } },
          { name: 'plan_id', in: 'query', schema: { type: 'integer' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }
        ],
        responses: {
          200: {
            description: 'Lista de usuários',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/User' } }, total: { type: 'integer' }, page: { type: 'integer' }, pages: { type: 'integer' } } } } }
          }
        }
      },
      post: {
        tags: ['Usuários'],
        summary: 'Criar ou atualizar usuário',
        description: 'Se `action=delete`, remove o usuário. Se `action=update`, atualiza.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } }
        },
        responses: {
          200: { description: 'Usuário criado/atualizado' },
          400: { description: 'CPF inválido ou dados faltando' }
        }
      }
    },

    // ===== ASSINATURAS =====
    '/subscriptions.php': {
      get: {
        tags: ['Assinaturas'],
        summary: 'Listar assinaturas',
        parameters: [
          { name: 'user_id', in: 'query', schema: { type: 'integer' } },
          { name: 'plan_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive', 'cancelled'] } }
        ],
        responses: { 200: { description: 'Lista de assinaturas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Subscription' } } } } } }
      },
      post: {
        tags: ['Assinaturas'],
        summary: 'Criar ou atualizar assinatura',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SubscriptionInput' } } }
        },
        responses: { 200: { description: 'Assinatura criada/atualizada' } }
      }
    },

    // ===== SINCRONIZAÇÃO =====
    '/sync.php': {
      get: {
        tags: ['Sincronização'],
        summary: 'Status geral da sincronização TOTVS',
        responses: { 200: { description: 'Status da sincronização' } }
      }
    },
    '/sync-service/status': {
      get: {
        tags: ['Sincronização'],
        summary: 'Status do serviço de sincronização',
        responses: { 200: { description: 'Status, intervalo, último run, próximo run' } }
      }
    },
    '/sync-service/logs': {
      get: {
        tags: ['Sincronização'],
        summary: 'Logs do serviço de sincronização',
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } }],
        responses: { 200: { description: 'Lista de logs' } }
      }
    },
    '/sync-service/config': {
      post: {
        tags: ['Sincronização'],
        summary: 'Atualizar configuração do serviço (intervalo, enabled)',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { interval: { type: 'integer', description: 'Intervalo em ms' }, enabled: { type: 'boolean' } } } } }
        },
        responses: { 200: { description: 'Configuração atualizada' } }
      }
    },
    '/sync-service/run-now': {
      post: {
        tags: ['Sincronização'],
        summary: 'Executar sincronização imediatamente',
        responses: { 200: { description: 'Sincronização iniciada' } }
      }
    },
    '/sync-service/clear': {
      post: {
        tags: ['Sincronização'],
        summary: 'Limpar logs de sincronização',
        responses: { 200: { description: 'Logs limpos' } }
      }
    },
    '/sync-service/synced-users': {
      get: {
        tags: ['Sincronização'],
        summary: 'Lista de usuários sincronizados com TOTVS',
        responses: { 200: { description: 'Lista de CPFs sincronizados' } }
      }
    },

    // ===== TOTVS =====
    '/totvs/search': {
      post: {
        tags: ['TOTVS'],
        summary: 'Buscar cliente no TOTVS',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { cpf: { type: 'string' }, name: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Dados do cliente no TOTVS' } }
      }
    },
    '/totvs/sync': {
      post: {
        tags: ['TOTVS'],
        summary: 'Sincronizar usuário específico para o TOTVS',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', required: ['userId'], properties: { userId: { type: 'integer' } } } } }
        },
        responses: {
          200: { description: 'Sincronizado com sucesso' },
          400: { description: 'Erro de validação (CPF inválido, dados incompletos)' }
        }
      }
    },
    '/totvs/check-exists': {
      post: {
        tags: ['TOTVS'],
        summary: 'Verificar se cliente já existe no TOTVS',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { cpf: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Resultado da verificação' } }
      }
    },
    '/totvs/health': {
      get: {
        tags: ['TOTVS'],
        summary: 'Status da conexão com TOTVS',
        responses: { 200: { description: 'Online/Offline com latência' } }
      }
    },

    // ===== CONFIGURAÇÕES =====
    '/config': {
      get: {
        tags: ['Configurações'],
        summary: 'Todas as configurações do sistema (autenticado)',
        responses: { 200: { description: 'Mapa de chave→valor', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, config: { type: 'object', example: { plans_enabled: true } } } } } } } }
      }
    },
    '/config/public': {
      get: {
        tags: ['Configurações'],
        summary: 'Configurações públicas (sem autenticação)',
        responses: { 200: { description: 'plans_enabled e configs públicas' } }
      }
    },
    '/config/{key}': {
      put: {
        tags: ['Configurações'],
        summary: 'Atualizar configuração por chave',
        parameters: [{ name: 'key', in: 'path', required: true, schema: { type: 'string', example: 'plans_enabled' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', required: ['value'], properties: { value: { description: 'Qualquer valor JSON' } } } } }
        },
        responses: { 200: { description: 'Configuração atualizada' } }
      }
    },
    '/season-config': {
      get: {
        tags: ['Configurações'],
        summary: 'Configuração de temporadas (alta/baixa)',
        responses: { 200: { description: 'Lista de períodos de alta temporada' } }
      },
      put: {
        tags: ['Configurações'],
        summary: 'Atualizar configuração de temporadas',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { periods: { type: 'array', items: { type: 'object', properties: { start: { type: 'string', example: '2026-12-15' }, end: { type: 'string', example: '2027-02-28' } } } } } } } }
        },
        responses: { 200: { description: 'Temporadas atualizadas' } }
      }
    },
    '/category-rates': {
      get: {
        tags: ['LP - Preços'],
        summary: 'Listar tarifas por categoria de hotel',
        responses: { 200: { description: 'Tarifas Silver, Gold, Diamante' } }
      }
    },
    '/category-rates/{categoryId}': {
      put: {
        tags: ['LP - Preços'],
        summary: 'Atualizar tarifa de uma categoria',
        parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { low_season_rate: { type: 'number' }, high_season_rate: { type: 'number' } } } } }
        },
        responses: { 200: { description: 'Tarifa atualizada' } }
      }
    },
    '/category-rates/sync': {
      post: {
        tags: ['LP - Preços'],
        summary: 'Sincronizar categorias de hotéis com Coobmais',
        responses: { 200: { description: 'Categorias sincronizadas' } }
      }
    },
    '/pricing-config': {
      get: {
        tags: ['LP - Preços'],
        summary: 'Configuração geral de preços (temporada + tarifas)',
        responses: { 200: { description: 'Configuração consolidada de preços' } }
      }
    },

    // ===== LP - AUTH =====
    '/lp/register': {
      post: {
        tags: ['LP - Auth'],
        summary: 'Registrar novo associado na Landing Page',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'cpf', 'email', 'phone'],
                properties: {
                  name: { type: 'string' },
                  cpf: { type: 'string', example: '123.456.789-00' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  cep: { type: 'string' },
                  address: { type: 'string' },
                  numero: { type: 'string' },
                  bairro: { type: 'string' },
                  cidade: { type: 'string' },
                  estado: { type: 'string' },
                  plan_id: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Registro realizado, retorna token de sessão' },
          400: { description: 'CPF duplicado ou dados inválidos' }
        }
      }
    },
    '/lp/login': {
      post: {
        tags: ['LP - Auth'],
        summary: 'Login do associado na Landing Page',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', required: ['cpf'], properties: { cpf: { type: 'string' }, email: { type: 'string' } } } } }
        },
        responses: {
          200: { description: 'Login OK, cookie lp_token definido' },
          401: { description: 'CPF não encontrado' }
        }
      }
    },
    '/lp/logout': {
      post: {
        tags: ['LP - Auth'],
        summary: 'Logout do associado (invalida sessão)',
        responses: { 200: { description: 'Sessão encerrada' } }
      }
    },
    '/lp/session': {
      get: {
        tags: ['LP - Auth'],
        summary: 'Dados da sessão atual do associado',
        responses: {
          200: { description: 'Dados do associado logado' },
          401: { description: 'Não autenticado' }
        }
      }
    },
    '/lp/profile': {
      patch: {
        tags: ['LP - Auth'],
        summary: 'Atualizar perfil do associado',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, cep: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Perfil atualizado' } }
      }
    },
    '/lp/plans': {
      get: {
        tags: ['LP - Auth'],
        summary: 'Planos disponíveis na Landing Page',
        responses: { 200: { description: 'Lista de planos ativos' } }
      }
    },
    '/lp/checkout': {
      post: {
        tags: ['LP - Auth'],
        summary: 'Processar checkout de plano na LP',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { plan_id: { type: 'integer' }, user_id: { type: 'integer' } } } } }
        },
        responses: { 200: { description: 'Checkout processado' } }
      }
    },

    // ===== LP - HOTÉIS =====
    '/lp/hotels': {
      post: {
        tags: ['LP - Hotéis'],
        summary: 'Buscar hotéis disponíveis por destino e datas',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['destination', 'checkIn', 'checkOut'],
                properties: {
                  destination: { type: 'string', example: 'Gramado' },
                  checkIn: { type: 'string', format: 'date', example: '2026-07-10' },
                  checkOut: { type: 'string', format: 'date', example: '2026-07-15' },
                  adults: { type: 'integer', default: 2 }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Lista de hotéis com disponibilidade e tarifas aplicadas' } }
      }
    },
    '/lp/featured-hotels': {
      get: {
        tags: ['LP - Hotéis'],
        summary: 'Hotéis em destaque para a home da LP',
        responses: { 200: { description: 'Lista de hotéis em destaque com preços de mercado' } }
      }
    },
    '/lp/hotel-info': {
      get: {
        tags: ['LP - Hotéis'],
        summary: 'Detalhes de um hotel específico',
        parameters: [{ name: 'hotelId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Dados completos do hotel (InfoHotels)' } }
      }
    },
    '/lp/cities': {
      post: {
        tags: ['LP - Hotéis'],
        summary: 'Buscar cidades disponíveis (autocomplete)',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { query: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Lista de cidades' } }
      }
    },
    '/lp/info-apartment': {
      post: {
        tags: ['LP - Hotéis'],
        summary: 'Informações e extras de um apartamento específico',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['hotelId', 'apartmentId', 'checkIn', 'checkOut'],
                properties: {
                  hotelId: { type: 'string' },
                  apartmentId: { type: 'string' },
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Detalhes do apartamento com extras/pacotes' } }
      }
    },
    '/lp/booking-alternatives': {
      post: {
        tags: ['LP - Hotéis'],
        summary: 'Buscar datas alternativas quando sem disponibilidade',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  hotelId: { type: 'string' },
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' },
                  extraDays: { type: 'integer', description: 'Dias adicionados (+1 a +5)' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Apartamentos em datas estendidas' } }
      }
    },
    '/lp/category-list': {
      get: {
        tags: ['LP - Hotéis'],
        summary: 'Lista de categorias de hotéis',
        responses: { 200: { description: 'Silver, Gold, Diamante' } }
      }
    },
    '/lp/category-rates-public': {
      get: {
        tags: ['LP - Preços'],
        summary: 'Tarifas por categoria (endpoint público para LP)',
        responses: { 200: { description: 'Tarifas de alta e baixa temporada por categoria' } }
      }
    },
    '/lp/market-prices': {
      get: {
        tags: ['LP - Preços'],
        summary: 'Preços de mercado dos hotéis (Google Hotels via SERP API)',
        parameters: [{ name: 'hotelIds', in: 'query', schema: { type: 'string' }, description: 'IDs separados por vírgula' }],
        responses: { 200: { description: 'Preços médios de mercado por hotel' } }
      }
    },
    '/lp/serp-prices': {
      get: {
        tags: ['LP - Preços'],
        summary: 'Preços de mercado via SERP API (endpoint alternativo)',
        responses: { 200: { description: 'Preços do Google Hotels' } }
      }
    },

    // ===== LP - RESERVAS =====
    '/lp/availability-book': {
      post: {
        tags: ['LP - Reservas'],
        summary: 'Verificar disponibilidade e iniciar reserva',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['hotelId', 'apartmentId', 'checkIn', 'checkOut'],
                properties: {
                  hotelId: { type: 'string' },
                  apartmentId: { type: 'string' },
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' },
                  guests: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Disponibilidade confirmada, localizador gerado' },
          409: { description: 'Apartamento indisponível' }
        }
      }
    },
    '/lp/booking-confirmation': {
      post: {
        tags: ['LP - Reservas'],
        summary: 'Confirmar reserva após pagamento',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['localizador'],
                properties: {
                  localizador: { type: 'string' },
                  guestData: { type: 'object' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Reserva confirmada no Coobmais' } }
      }
    },
    '/lp/bookings': {
      post: {
        tags: ['LP - Reservas'],
        summary: 'Salvar reserva no banco local',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['localizador', 'hotel_id', 'check_in', 'check_out'],
                properties: {
                  localizador: { type: 'string' },
                  hotel_id: { type: 'string' },
                  hotel_name: { type: 'string' },
                  apartment_type: { type: 'string' },
                  check_in: { type: 'string', format: 'date' },
                  check_out: { type: 'string', format: 'date' },
                  total_amount: { type: 'number' },
                  guests: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Reserva salva' } }
      },
      get: {
        tags: ['LP - Reservas'],
        summary: 'Listar reservas do associado logado',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['confirmed', 'cancelled', 'pending'] } }
        ],
        responses: { 200: { description: 'Lista de reservas do associado' } }
      }
    },
    '/lp/bookings/{id}/cancel': {
      patch: {
        tags: ['LP - Reservas'],
        summary: 'Cancelar reserva',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { reason: { type: 'string' } } } } }
        },
        responses: {
          200: { description: 'Reserva cancelada' },
          404: { description: 'Reserva não encontrada' }
        }
      }
    },
    '/lp/bookings/{id}/payment': {
      patch: {
        tags: ['LP - Reservas'],
        summary: 'Atualizar status de pagamento de uma reserva',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { payment_status: { type: 'string' }, vindi_bill_id: { type: 'integer' } } } } }
        },
        responses: { 200: { description: 'Status de pagamento atualizado' } }
      }
    },
    '/lp/bookings/{localizador}/link-payment': {
      patch: {
        tags: ['LP - Reservas'],
        summary: 'Vincular pagamento Vindi a uma reserva por localizador',
        parameters: [{ name: 'localizador', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { vindi_bill_id: { type: 'integer' }, amount: { type: 'number' } } } } }
        },
        responses: { 200: { description: 'Pagamento vinculado' } }
      }
    },

    // ===== LP - PAGAMENTOS =====
    '/vindi/payment-methods': {
      get: {
        tags: ['LP - Pagamentos'],
        summary: 'Métodos de pagamento disponíveis na Vindi',
        responses: { 200: { description: 'Lista de métodos (cartao_unyco, pix_unyco, etc.)' } }
      }
    },
    '/vindi/create-bill': {
      post: {
        tags: ['LP - Pagamentos'],
        summary: 'Criar cobrança na Vindi',
        description: 'Cria cliente, payment_profile (cartão) e bill. Retorna dados do PIX para `pix_unyco` ou status do cartão para `cartao_unyco`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['payment_method_code', 'customer_name', 'customer_cpf', 'amount'],
                properties: {
                  payment_method_code: { type: 'string', enum: ['pix_unyco', 'cartao_unyco'], example: 'pix_unyco' },
                  customer_name: { type: 'string' },
                  customer_cpf: { type: 'string', example: '123.456.789-00' },
                  customer_email: { type: 'string' },
                  customer_phone: { type: 'string' },
                  customer_address: { type: 'object', properties: { zipcode: { type: 'string' }, street: { type: 'string' }, number: { type: 'string' }, neighborhood: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' } } },
                  amount: { type: 'number', example: 450.00 },
                  description: { type: 'string' },
                  booking_locator: { type: 'string' },
                  hotel_name: { type: 'string' },
                  installments: { type: 'integer', default: 1 },
                  card_number: { type: 'string', description: 'Obrigatório para cartao_unyco' },
                  card_expiration: { type: 'string', example: '12/28' },
                  card_cvv: { type: 'string' },
                  card_holder_name: { type: 'string' },
                  card_company_code: { type: 'string', example: 'visa' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Cobrança criada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        bill_id: { type: 'integer' },
                        charge_id: { type: 'integer' },
                        charge_status: { type: 'string' },
                        pix: {
                          type: 'object',
                          properties: {
                            qrcode_original_path: { type: 'string', description: 'Código EMV (Pix Copia e Cola)' },
                            qrcode_path: { type: 'string', description: 'URL da imagem SVG do QR Code' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          422: { description: 'Cartão recusado ou dados inválidos' }
        }
      }
    },
    '/vindi/bill/{id}': {
      get: {
        tags: ['LP - Pagamentos'],
        summary: 'Consultar status de uma cobrança Vindi (polling PIX)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID da bill Vindi' }],
        responses: {
          200: {
            description: 'Status da cobrança',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    data: { type: 'object', properties: { bill_id: { type: 'integer' }, charge_status: { type: 'string', enum: ['pending', 'paid', 'canceled', 'failed'] } } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/payments': {
      get: {
        tags: ['LP - Pagamentos'],
        summary: 'Listar pagamentos registrados',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'method', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Lista de pagamentos com estatísticas' } }
      }
    },
    '/payments/{id}/refresh': {
      post: {
        tags: ['LP - Pagamentos'],
        summary: 'Atualizar status de um pagamento consultando a Vindi',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Status atualizado' } }
      }
    },

    // ===== WHATSAPP =====
    '/whatsapp/config': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Obter configuração da API WhatsApp',
        responses: { 200: { description: 'URL e token (mascarado)' } }
      },
      put: {
        tags: ['WhatsApp'],
        summary: 'Atualizar configuração da API WhatsApp',
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { api_url: { type: 'string' }, api_token: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Configuração salva' } }
      }
    },
    '/whatsapp/flows': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Listar fluxos de automação WhatsApp',
        responses: { 200: { description: 'Lista de fluxos' } }
      },
      post: {
        tags: ['WhatsApp'],
        summary: 'Criar novo fluxo',
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/WhatsAppFlow' } } }
        },
        responses: { 200: { description: 'Fluxo criado' } }
      }
    },
    '/whatsapp/flows/{id}': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Obter fluxo por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Dados do fluxo' } }
      },
      put: {
        tags: ['WhatsApp'],
        summary: 'Atualizar fluxo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/WhatsAppFlow' } } }
        },
        responses: { 200: { description: 'Fluxo atualizado' } }
      },
      delete: {
        tags: ['WhatsApp'],
        summary: 'Remover fluxo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Fluxo removido' } }
      }
    },
    '/whatsapp/flows/{id}/toggle': {
      patch: {
        tags: ['WhatsApp'],
        summary: 'Ativar/desativar fluxo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Status alterado' } }
      }
    },
    '/whatsapp/test': {
      post: {
        tags: ['WhatsApp'],
        summary: 'Testar envio de fluxo WhatsApp',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['flowId', 'phone'],
                properties: {
                  flowId: { type: 'integer' },
                  phone: { type: 'string', example: '5554999999999' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Teste iniciado, retorna testId para polling' } }
      }
    },
    '/whatsapp/test/{testId}': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Consultar resultado de teste WhatsApp',
        parameters: [{ name: 'testId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Status e progresso do teste' } }
      }
    },
    '/whatsapp/logs': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Logs de envios WhatsApp',
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } }],
        responses: { 200: { description: 'Lista de logs' } }
      }
    },
    '/whatsapp/stats': {
      get: {
        tags: ['WhatsApp'],
        summary: 'Estatísticas de envios WhatsApp',
        responses: { 200: { description: 'Totais por status (enviado, erro, pendente)' } }
      }
    },

    // ===== ADMIN =====
    '/admin/bookings': {
      get: {
        tags: ['Admin'],
        summary: 'Listar todas as reservas (visão administrativa)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'hotel', in: 'query', schema: { type: 'string' } },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' } }
        ],
        responses: { 200: { description: 'Lista paginada de reservas com totais' } }
      }
    },

    // ===== CENTRAL DE APIS =====
    '/central/health': {
      get: {
        tags: ['Central de APIs'],
        summary: 'Health check de todas as APIs externas',
        responses: { 200: { description: 'Status (online/offline/latência) de TOTVS, Coobmais, Vindi, WhatsApp, ViaCEP' } }
      }
    },
    '/central/apis': {
      get: {
        tags: ['Central de APIs'],
        summary: 'Listar APIs configuradas com status e endpoints',
        responses: { 200: { description: 'Configuração e status de cada API' } }
      }
    },
    '/central/config': {
      get: {
        tags: ['Central de APIs'],
        summary: 'Configurações atuais das APIs (tokens mascarados)',
        responses: { 200: { description: 'URLs e tokens das APIs externas' } }
      }
    },
    '/central/apis/{name}': {
      put: {
        tags: ['Central de APIs'],
        summary: 'Atualizar configuração de uma API (token, URL)',
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string', enum: ['TOTVS', 'Coobmais', 'Vindi', 'WhatsApp'] } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, url: { type: 'string' }, accessKey: { type: 'string' }, password: { type: 'string' } } } } }
        },
        responses: { 200: { description: 'Configuração atualizada e aplicada em tempo real' } }
      }
    },
    '/central/coobmais/token': {
      get: {
        tags: ['Central de APIs'],
        summary: 'Ver token JWT atual do Coobmais e expiração',
        responses: { 200: { description: 'Token (parcial) e timestamp de expiração' } }
      }
    },
    '/central/coobmais/refresh-token': {
      post: {
        tags: ['Central de APIs'],
        summary: 'Forçar regeneração do token JWT do Coobmais',
        responses: { 200: { description: 'Novo token gerado' } }
      }
    }
  },

  components: {
    schemas: {
      Plan: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          active: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      PlanInput: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          id: { type: 'integer', description: 'Omitir para criar novo' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          active: { type: 'boolean', default: true }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          cpf: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          cep: { type: 'string' },
          cidade: { type: 'string' },
          estado: { type: 'string' },
          plan_id: { type: 'integer' },
          synced_at: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      UserInput: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['create', 'update', 'delete'] },
          id: { type: 'integer' },
          name: { type: 'string' },
          cpf: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          plan_id: { type: 'integer' }
        }
      },
      Subscription: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          user_id: { type: 'integer' },
          plan_id: { type: 'integer' },
          status: { type: 'string' },
          start_date: { type: 'string', format: 'date' },
          end_date: { type: 'string', format: 'date' }
        }
      },
      SubscriptionInput: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          plan_id: { type: 'integer' },
          status: { type: 'string', enum: ['active', 'inactive', 'cancelled'] },
          start_date: { type: 'string', format: 'date' },
          end_date: { type: 'string', format: 'date' }
        }
      },
      WhatsAppFlow: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          trigger: { type: 'string', enum: ['booking_confirmed', 'booking_cancelled', 'registration_completed'] },
          active: { type: 'boolean' },
          nodes: { type: 'array', items: { type: 'object', properties: { type: { type: 'string', enum: ['trigger', 'delay', 'message'] }, content: { type: 'string' }, delay: { type: 'integer' } } } }
        }
      }
    }
  }
};
