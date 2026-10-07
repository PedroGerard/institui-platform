# Primeiro envio para o GitHub

> Documento historico. O repositorio atual ja esta conectado em
> `https://github.com/PedroGerard/institui-platform.git`.
> Nao usar este arquivo como guia de publicacao atual.

Repositório recomendado:

```text
PedroGerard/institui-platform
```

Configuração recomendada no GitHub:

- Nome: `institui-platform`
- Visibilidade: privado
- Não marcar README
- Não marcar `.gitignore`
- Não marcar licença

Depois de criar o repositório vazio no GitHub, abrir o terminal normal do Windows nesta pasta:

```powershell
cd C:\Users\user\Documents\INSTITUI+
```

Se o Git pedir nome e e-mail:

```powershell
git config user.name "PedroGerard"
git config user.email "132625638+PedroGerard@users.noreply.github.com"
```

Fazer o primeiro commit:

```powershell
git add .
git commit -m "Primeira versão do site do Instituto Incentive"
```

Conectar ao GitHub:

```powershell
git remote add origin https://github.com/PedroGerard/institui-platform.git
git push -u origin main
```

## Opção rápida com o commit já preparado pelo Codex

Se a pasta `git-upload-meta` existir, o commit inicial já foi criado localmente por aqui. Nesse caso, depois de abrir o terminal normal do Windows nesta pasta, basta rodar:

```powershell
git --git-dir=git-upload-meta --work-tree=. push -u origin main
```

Depois do envio, o GitHub Actions deve rodar automaticamente a validação do frontend.
