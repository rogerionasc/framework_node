import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const HeroSection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  color: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const Button = styled(Link)`
  background-color: ${props => props.variant === 'outline' ? 'transparent' : 'white'};
  color: ${props => props.variant === 'outline' ? 'white' : '#667eea'};
  border: 2px solid white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    background-color: white;
    color: #667eea;
  }
`;

const FeaturesSection = styled.section`
  background: white;
  padding: 4rem 1rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsSection = styled.section`
  background: #667eea;
  color: white;
  padding: 3rem 1rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <Title>
            {isAuthenticated ? `Bem-vindo, ${user?.username}!` : 'Framework Node + React'}
          </Title>
          <Subtitle>
            Uma framework completa para desenvolvimento full-stack com Node.js, React e SQLite.
            Autenticação JWT, CRUD completo e interface moderna.
          </Subtitle>
          
          <ButtonGroup>
            {isAuthenticated ? (
              <>
                <Button to="/dashboard">Ir para Dashboard</Button>
                <Button to="/posts" variant="outline">Ver Posts</Button>
              </>
            ) : (
              <>
                <Button to="/register">Começar Agora</Button>
                <Button to="/login" variant="outline">Fazer Login</Button>
              </>
            )}
          </ButtonGroup>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>Recursos Principais</SectionTitle>
          <SectionSubtitle>
            Tudo que você precisa para criar aplicações web modernas
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🚀</FeatureIcon>
              <FeatureTitle>Performance</FeatureTitle>
              <FeatureDescription>
                Backend otimizado com Node.js e Express, frontend reativo com React.
                Carregamento rápido e experiência fluida.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>Segurança</FeatureTitle>
              <FeatureDescription>
                Autenticação JWT, validação de dados, proteção contra ataques comuns.
                Suas informações sempre protegidas.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💾</FeatureIcon>
              <FeatureTitle>Banco de Dados</FeatureTitle>
              <FeatureDescription>
                SQLite integrado para desenvolvimento rápido. Fácil migração para
                PostgreSQL ou MySQL em produção.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📱</FeatureIcon>
              <FeatureTitle>Responsivo</FeatureTitle>
              <FeatureDescription>
                Interface adaptável para todos os dispositivos. Design moderno
                e componentes reutilizáveis.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>API RESTful</FeatureTitle>
              <FeatureDescription>
                API completa com CRUD, paginação, filtros e validação.
                Documentação clara e endpoints bem estruturados.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🛠️</FeatureIcon>
              <FeatureTitle>Desenvolvimento</FeatureTitle>
              <FeatureDescription>
                Hot reload, estrutura organizada, componentes modulares.
                Produtividade máxima para desenvolvedores.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <StatsSection>
        <Container>
          <SectionTitle>Framework em Números</SectionTitle>
          
          <StatsGrid>
            <StatCard>
              <StatNumber>100%</StatNumber>
              <StatLabel>Open Source</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>5+</StatNumber>
              <StatLabel>Tecnologias Integradas</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>∞</StatNumber>
              <StatLabel>Possibilidades</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Disponibilidade</StatLabel>
            </StatCard>
          </StatsGrid>
        </Container>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;