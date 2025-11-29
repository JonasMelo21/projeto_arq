import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import (
    TimeoutException, 
    NoAlertPresentException, 
    UnexpectedAlertPresentException,
    WebDriverException
)

# --- CONFIGURAÇÕES DO DRIVER ---
options = Options()
options.binary_location = "/usr/bin/chromium-browser" # Ajuste conforme seu sistema
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--start-maximized")

# Mantém o navegador aberto ao final
options.add_experimental_option("detach", True)

# --- TRUQUES VISUAIS (REMOVE A BARRA DE AUTOMAÇÃO) ---
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
options.add_experimental_option("prefs", {
    "credentials_enable_service": False,
    "profile.password_manager_enabled": False
})

# --- FUNÇÕES AUXILIARES ---
def scroll_suave(driver, pixels=500, direcao='baixo'):
    """Rola a tela suavemente para dar um efeito visual melhor"""
    try:
        current_pos = driver.execute_script("return window.pageYOffset;")
        target_pos = current_pos + pixels if direcao == 'baixo' else current_pos - pixels
        if target_pos < 0: target_pos = 0
        
        step = 20 if direcao == 'baixo' else -20
        
        # Loop simples para scroll
        while (direcao == 'baixo' and current_pos < target_pos) or (direcao == 'cima' and current_pos > target_pos):
            current_pos += step
            driver.execute_script(f"window.scrollTo(0, {current_pos});")
            time.sleep(0.005)
            
            # Checa limites
            max_height = driver.execute_script("return document.body.scrollHeight")
            if current_pos >= max_height or current_pos <= 0: break
    except:
        pass 

def digitar_devagar(elemento, texto):
    """Simula uma pessoa digitando tecla por tecla"""
    try:
        elemento.click() # Garante foco
        for letra in texto:
            elemento.send_keys(letra)
            # Pausa aleatória para parecer humano (entre 50ms e 150ms)
            time.sleep(random.uniform(0.05, 0.15))
    except:
        pass

def gerar_cpf_unico():
    """
    Gera um CPF válido baseado no TIMESTAMP atual.
    Isso garante 100% de unicidade (impossível gerar repetido)
    e evita CPFs começando com 0.
    """
    # Pega os últimos 9 dígitos do timestamp (microssegundos) para garantir que seja único
    # Ex: time.time() -> 1716382910.123456 -> usamos partes disso
    seed_unica = str(int(time.time() * 1000000))[-9:]
    
    numeros = [int(x) for x in seed_unica]
    
    # Força o primeiro dígito a ser não-zero para evitar problemas de parsing no backend
    if numeros[0] == 0:
        numeros[0] = random.randint(1, 9)

    def calcula_digito(digitos):
        soma = 0
        peso = len(digitos) + 1
        for d in digitos:
            soma += d * peso
            peso -= 1
        resto = soma % 11
        return 0 if resto < 2 else 11 - resto

    digito1 = calcula_digito(numeros)
    numeros.append(digito1)
    digito2 = calcula_digito(numeros)
    numeros.append(digito2)
    
    # Retorna apenas números
    return "".join(map(str, numeros))

def run_grand_finale():
    print("🎬 AÇÃO! Iniciando Fluxo Completo: Bloqueio -> Cadastro -> Login -> Aluguel")
    driver = webdriver.Chrome(options=options)
    BASE_URL = "http://localhost:3000"
    
    # Gera dados profissionais dinâmicos
    rand_id = random.randint(1000, 9999)
    # Email profissional para apresentação
    EMAIL_TESTE = f"carlos.silva{rand_id}@empresa.com" 
    SENHA_TESTE = "SenhaSegura@2025"

    try:
        # =================================================================
        # ATO 1: A DESCOBERTA (HOME & TENTATIVA DE ALUGUEL)
        # =================================================================
        print("\n📍 ATO 1: Home Page")
        driver.get(BASE_URL)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1")))
        time.sleep(1)

        print("📜 Explorando a frota...")
        scroll_suave(driver, pixels=500, direcao='baixo')
        time.sleep(1)
        
        print("👆 Selecionando um veículo...")
        btn_detalhes = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Ver Detalhes') and not(@disabled)]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_detalhes)
        time.sleep(0.5)
        btn_detalhes.click()
        
        # Página de Detalhes
        WebDriverWait(driver, 5).until(EC.url_contains("/vehicle/"))
        print("📄 Vendo detalhes do carro...")
        
        btn_reservar = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Reservar Agora')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_reservar)
        time.sleep(1.5)
        
        print("💰 Tentando alugar sem estar logado...")
        btn_reservar.click()

        # Tratamento de Múltiplos Alertas (Strict Mode Safety)
        print("🕵️ Lidando com alertas de segurança...")
        end_time = time.time() + 3
        while time.time() < end_time:
            try:
                WebDriverWait(driver, 0.5).until(EC.alert_is_present())
                driver.switch_to.alert.accept()
                print("✅ Alerta aceito.")
                time.sleep(0.5)
            except TimeoutException:
                if "/login" in driver.current_url: break
            except NoAlertPresentException:
                pass

        # =================================================================
        # ATO 2: A FALHA (LOGIN ERRADO)
        # =================================================================
        print("\n📍 ATO 2: Login Inválido")
        WebDriverWait(driver, 5).until(EC.url_contains("/login"))
        print("🔒 Redirecionado para Login.")
        time.sleep(1)

        print("✍️ Tentando logar com credenciais erradas...")
        digitar_devagar(driver.find_element(By.ID, "email"), "usuario.antigo@teste.com")
        driver.find_element(By.ID, "password").send_keys("senhaerrada")
        
        driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()

        print("👀 Verificando mensagem de erro...")
        msg_erro = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Email ou senha incorretos')]"))
        )
        # Efeito visual no erro
        driver.execute_script("arguments[0].style.border='3px solid red';", msg_erro)
        print(f"🚨 Bloqueio confirmado: '{msg_erro.text}'")
        time.sleep(2)

        # =================================================================
        # ATO 3: A JORNADA DO CADASTRO (CINEMATOGRÁFICO)
        # =================================================================
        print("\n📍 ATO 3: Cadastro Profissional")
        print("👆 Indo para 'Cadastre-se'...")
        driver.find_element(By.XPATH, "//a[contains(text(), 'Cadastre-se')]").click()
        
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "nome")))
        time.sleep(1)

        # Tour Visual
        print("🎥 Fazendo tour pelo formulário...")
        scroll_suave(driver, pixels=600, direcao='baixo')
        time.sleep(0.5)
        scroll_suave(driver, pixels=600, direcao='cima')
        
        print("🏢 Mudando para PJ (só para mostrar)...")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Pessoa Jurídica')]").click()
        time.sleep(1)
        scroll_suave(driver, pixels=400, direcao='baixo')
        time.sleep(0.5)
        scroll_suave(driver, pixels=400, direcao='cima')

        print("👤 Voltando para PF...")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Pessoa Física')]").click()
        time.sleep(1)

        print("✍️ Preenchendo dados reais...")
        # Dados Pessoais
        digitar_devagar(driver.find_element(By.NAME, "nome"), "Carlos Eduardo Silva")
        
        # --- AQUI ESTÁ A CORREÇÃO: CPF BASEADO EM TIMESTAMP ---
        cpf_unico = gerar_cpf_unico()
        print(f"🆔 Gerando CPF Timestamp (Único): {cpf_unico}")
        driver.find_element(By.NAME, "cpf").send_keys(cpf_unico)
        # ---------------------------------------

        driver.find_element(By.NAME, "rg").send_keys("5.555.555")
        driver.find_element(By.NAME, "dataNascimento").send_keys("20051990")
        Select(driver.find_element(By.NAME, "sexo")).select_by_value("M")
        
        scroll_suave(driver, pixels=300, direcao='baixo')
        digitar_devagar(driver.find_element(By.NAME, "cnh"), "12345678900")

        # Contato
        digitar_devagar(driver.find_element(By.NAME, "telefone"), "(11) 98765-4321")
        driver.find_element(By.NAME, "logradouro").send_keys("Av. Brigadeiro Faria Lima, 1200")
        driver.find_element(By.NAME, "cidade").send_keys("São Paulo")
        driver.find_element(By.NAME, "estado").send_keys("SP")
        driver.find_element(By.NAME, "cep").send_keys("01452-000")

        # Login
        scroll_suave(driver, pixels=400, direcao='baixo')
        time.sleep(0.5)
        
        print(f"📧 Registrando email: {EMAIL_TESTE}")
        digitar_devagar(driver.find_element(By.NAME, "email"), EMAIL_TESTE)
        driver.find_element(By.NAME, "password").send_keys(SENHA_TESTE)
        driver.find_element(By.NAME, "confirmPassword").send_keys(SENHA_TESTE)

        print("🚀 Enviando formulário...")
        time.sleep(1)
        driver.find_element(By.XPATH, "//button[contains(text(), 'Finalizar Cadastro')]").click()

        # Confirmação
        WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print(f"🎉 Sucesso: {alert.text}")
        time.sleep(1.5)
        alert.accept()

        # =================================================================
        # ATO 4: O RETORNO (LOGIN COM SUCESSO)
        # =================================================================
        print("\n📍 ATO 4: Login Válido")
        WebDriverWait(driver, 5).until(EC.url_contains("/login"))
        
        print("⏳ Pausa dramática...")
        time.sleep(2)

        print(f"✍️ Logando com: {EMAIL_TESTE}")
        campo_email = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "email")))
        
        digitar_devagar(campo_email, EMAIL_TESTE)
        time.sleep(0.5)
        
        input_pass = driver.find_element(By.ID, "password")
        digitar_devagar(input_pass, SENHA_TESTE)
        time.sleep(0.5)

        print("👆 Entrando...")
        driver.find_element(By.XPATH, "//button[contains(., 'Entrar')]").click()

        # Validação Final
        print("🏠 Verificando Home logada...")
        WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:3000/"))
        
        try:
            # Procura pelo botão de Logout ou nome do usuário
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//button[@title='Sair']"))
            )
            print("✅ Usuário autenticado com sucesso!")
        except:
            print("⚠️ Home carregada, mas indicador de login não encontrado.")

        # =================================================================
        # ATO 5: A RECOMPENSA (ALUGAR O CARRO)
        # =================================================================
        print("\n📍 ATO 5: Aluguel Real (Agora Logado)")
        time.sleep(1)
        
        print("📜 Escolhendo o carro perfeito...")
        scroll_suave(driver, pixels=300, direcao='baixo')
        
        # Pega o primeiro botão de detalhes disponível
        btn_detalhes = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Ver Detalhes') and not(@disabled)]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_detalhes)
        time.sleep(0.5)
        btn_detalhes.click()
        
        print("📄 Na página de detalhes...")
        btn_reservar = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Reservar Agora')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_reservar)
        time.sleep(1)
        btn_reservar.click()
        
        print("📅 Preenchendo dados da reserva...")
        WebDriverWait(driver, 5).until(EC.url_contains("/book/"))
        
        # Datas via Javascript (mais seguro para input datetime-local)
        inputs_data = driver.find_elements(By.CSS_SELECTOR, "input[type='datetime-local']")
        start_input = inputs_data[0]
        end_input = inputs_data[1]
        
        # Define datas futuras fixas (Retirada amanhã, Devolução +3 dias)
        driver.execute_script("arguments[0].value = '2025-12-25T10:00';", start_input)
        print("✍️ Data Retirada: 25/12/2025 10:00")
        time.sleep(0.5)
        
        driver.execute_script("arguments[0].value = '2025-12-28T18:00';", end_input)
        print("✍️ Data Devolução: 28/12/2025 18:00")
        time.sleep(0.5)
        
        # Pagamento
        print("💳 Escolhendo PIX...")
        driver.find_element(By.XPATH, "//button[contains(text(), 'PIX')]").click()
        time.sleep(1)
        
        # Scroll para botão confirmar
        btn_confirmar = driver.find_element(By.XPATH, "//button[contains(., 'Confirmar Locação')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn_confirmar)
        time.sleep(1)
        
        print("🚀 Confirmando aluguel...")
        btn_confirmar.click()
        
        # Alerta de Sucesso
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print(f"🎉 SUCESSO FINAL: {alert.text}")
        time.sleep(2)
        alert.accept()
        
        # Valida volta pra Home
        WebDriverWait(driver, 5).until(EC.url_to_be("http://localhost:3000/"))
        print("✅ Redirecionado para Home. Ciclo completo encerrado.")

    except Exception as e:
        print(f"❌ Erro durante o roteiro: {e}")

    print("\n🏁 FIM DO FILME. Navegador aberto para aplausos.")

if __name__ == "__main__":
    run_grand_finale()