# Risky Bit Chat Backend
> Diploma 2026/27

Chat backend of the RiskyBit project, made as the practical part of the team's diploma.


## Description
The chat service for [RiskyBit](https://github.com/DA-Risky-Bit/RiskyBit), a software collection in Docker that provides an environment for hacking challenges for companies and schools. It handles <real-time messaging between participants, channels, message history>. Built with Express.js.

## Installation
This service is part of the RiskyBit compose setup. For a normal installation, use the [main repository](https://github.com/DA-Risky-Bit/RiskyBit) instead.

### Local development

Install the dependencies:

```bash
npm install
```

Start the service:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

### Docker

```bash
docker build -t riskybit-chat-backend .
docker run -p 3000:3000 riskybit-chat-backend
```

## License
This project is licensed under MIT, specifics in:
[License](LICENSE)

## Contact
**Main Contact:** [contact@riskybit.com](mailto:contact@riskybit.com)

Team:
- **Valerian Hobel** – @htl3r-2135 [valerian.hobel@htl.rennweg.at](mailto:valerian.hobel@htl.rennweg.at)
- **Christoph Neumayer** – @ItzVoxel [christoph.neumayer@htl.rennweg.at](mailto:christoph.neumayer@htl.rennweg.at)
- **Gabriel Berger** – @htl3r-2129 [gabriel.berger@htl.rennweg.at](mailto:gabriel.berger@htl.rennweg.at)
- **Alexander Reiter** – @Sunnickel [alexander.reiter@htl.rennweg.at](mailto:alexander.reiter@htl.rennweg.at)
