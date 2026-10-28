# Digital Heritage: Pattern Studio

An interactive web-based studio that bridges ancient Chinese aesthetics with modern digital code. Designed for the Digital Media Competition 2026.

## 📖 About the Project

**Digital Heritage** is a full-stack web application that allows users to create, save, and share symmetrical patterns inspired by traditional Chinese art. The project features two distinct modes:

1. **Generator Mode:** A mathematically precise tool to create mandala-like patterns inspired by Ming Dynasty porcelain and traditional paper-cutting (Jianzhi).
2. **Ink Brush Mode:** A freehand drawing canvas that emulates the feel of traditional Chinese calligraphy (Shufa) and ink wash painting (Guohua).

Additionally, the app includes a "Digital Museum" gallery where users can view, filter, and download their masterpieces.

## Tech Stack

- **Backend:** ASP.NET Core 8 (MVC), C#
- **Database:** Entity Framework Core 8, SQL Server
- **Frontend:** HTML5 Canvas, p5.js, Vanilla JavaScript, CSS3
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, Web)
- **Features:** REST API, Dependency Injection, Custom animations, Multi-language support (EN/CN)

## Architecture

The project follows **Clean Architecture** principles, divided into 4 layers:

- **Domain:** Core entities and business models (`Artifact`).
- **Application:** Business logic, interfaces (`IArtifactService`), and DTOs.
- **Infrastructure:** Database context (`AppDbContext`), migrations, and EF Core configuration.
- **Web:** MVC Controllers, Razor Views, and frontend assets.

## How to Run Locally

1. Clone the repository:
   `git clone https://github.com/edankart/DigitalCaligrapher.git`

2. Navigate to the solution folder and update the database:
   `dotnet ef database update --project DigitalHeritage.Infrastructure --startup-project DigitalHeritage.Web`

3. Run the project:
   `dotnet run --project DigitalHeritage.Web`

4. Open your browser and go to `https://localhost:7123` (or the port shown in your console).

## Features Showcase

- **Real-time Rendering:** Powered by p5.js for instant visual feedback.
- **Cultural Insights:** Dynamic tooltips explain the cultural significance of different patterns and palettes.
- **Animated Elements:** A floating fan on the landing page and an auto-drawing pencil for idle users.
- **Bilingual:** Full support for English and Chinese (中文) with a simple toggle.

## Author

**Edan Kart**

- GitHub: [@edankart](https://github.com/edankart)
- Project Link: [Digital Heritage](https://github.com/edankart/DigitalCaligrapher)
