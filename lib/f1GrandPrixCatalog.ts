/**
 * lib/f1GrandPrixCatalog.ts
 * Comprehensive Offline & Fallback Grand Prix Calendar and Session Intelligence.
 * Covers full 2024, 2023, 2022, 2021 F1 World Championship seasons:
 * - Full 22 to 24 Grands Prix for each season
 * - Official session types (Race, Qualifying, Sprint)
 * - Complete 20-driver starting grids for all seasons
 * - Dynamic stint & telemetry generation for offline / rate-limited environments
 */

import type { Session, Driver, Stint, RaceControlMessage } from './types';

export const F1_CATALOG_SESSIONS_BY_YEAR: Record<number, Session[]> = {
  "2025": [
    {
        "session_key": 2025011,
        "meeting_key": 202501,
        "meeting_name": "Australian Grand Prix",
        "meeting_official_name": "Formula 1 Louis Vuitton Australian Grand Prix 2025",
        "location": "Melbourne",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-03-16T04:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025012,
        "meeting_key": 202501,
        "meeting_name": "Australian Grand Prix",
        "meeting_official_name": "Formula 1 Louis Vuitton Australian Grand Prix 2025",
        "location": "Melbourne",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-03-15T04:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025021,
        "meeting_key": 202502,
        "meeting_name": "Chinese Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2025",
        "location": "Shanghai",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-03-23T07:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025022,
        "meeting_key": 202502,
        "meeting_name": "Chinese Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2025",
        "location": "Shanghai",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-03-22T07:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025023,
        "meeting_key": 202502,
        "meeting_name": "Chinese Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2025",
        "location": "Shanghai",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-03-22T03:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025031,
        "meeting_key": 202503,
        "meeting_name": "Japanese Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises Japanese Grand Prix 2025",
        "location": "Suzuka",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-04-06T05:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025032,
        "meeting_key": 202503,
        "meeting_name": "Japanese Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises Japanese Grand Prix 2025",
        "location": "Suzuka",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-04-05T05:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025041,
        "meeting_key": 202504,
        "meeting_name": "Bahrain Grand Prix",
        "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2025",
        "location": "Sakhir",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-04-13T15:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025042,
        "meeting_key": 202504,
        "meeting_name": "Bahrain Grand Prix",
        "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2025",
        "location": "Sakhir",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-04-12T15:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025051,
        "meeting_key": 202505,
        "meeting_name": "Saudi Arabian Grand Prix",
        "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2025",
        "location": "Jeddah",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-04-20T17:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025052,
        "meeting_key": 202505,
        "meeting_name": "Saudi Arabian Grand Prix",
        "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2025",
        "location": "Jeddah",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-04-19T17:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025061,
        "meeting_key": 202506,
        "meeting_name": "Miami Grand Prix",
        "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2025",
        "location": "Miami",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-05-04T20:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025062,
        "meeting_key": 202506,
        "meeting_name": "Miami Grand Prix",
        "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2025",
        "location": "Miami",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-05-03T20:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025063,
        "meeting_key": 202506,
        "meeting_name": "Miami Grand Prix",
        "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2025",
        "location": "Miami",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-05-03T16:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025071,
        "meeting_key": 202507,
        "meeting_name": "Emilia Romagna Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises Gran Premio dell'Emilia-Romagna 2025",
        "location": "Imola",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-05-18T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025072,
        "meeting_key": 202507,
        "meeting_name": "Emilia Romagna Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises Gran Premio dell'Emilia-Romagna 2025",
        "location": "Imola",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-05-17T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025081,
        "meeting_key": 202508,
        "meeting_name": "Monaco Grand Prix",
        "meeting_official_name": "Formula 1 Grand Prix de Monaco 2025",
        "location": "Monaco",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-05-25T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025082,
        "meeting_key": 202508,
        "meeting_name": "Monaco Grand Prix",
        "meeting_official_name": "Formula 1 Grand Prix de Monaco 2025",
        "location": "Monaco",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-05-24T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025091,
        "meeting_key": 202509,
        "meeting_name": "Spanish Grand Prix",
        "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2025",
        "location": "Barcelona",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-06-01T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025092,
        "meeting_key": 202509,
        "meeting_name": "Spanish Grand Prix",
        "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2025",
        "location": "Barcelona",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-05-31T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025101,
        "meeting_key": 202510,
        "meeting_name": "Canadian Grand Prix",
        "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2025",
        "location": "Montreal",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-06-15T18:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025102,
        "meeting_key": 202510,
        "meeting_name": "Canadian Grand Prix",
        "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2025",
        "location": "Montreal",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-06-14T18:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025111,
        "meeting_key": 202511,
        "meeting_name": "Austrian Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2025",
        "location": "Spielberg",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-06-29T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025112,
        "meeting_key": 202511,
        "meeting_name": "Austrian Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2025",
        "location": "Spielberg",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-06-28T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025113,
        "meeting_key": 202511,
        "meeting_name": "Austrian Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2025",
        "location": "Spielberg",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-06-28T09:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025121,
        "meeting_key": 202512,
        "meeting_name": "British Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways British Grand Prix 2025",
        "location": "Silverstone",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-07-06T14:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025122,
        "meeting_key": 202512,
        "meeting_name": "British Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways British Grand Prix 2025",
        "location": "Silverstone",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-07-05T14:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025131,
        "meeting_key": 202513,
        "meeting_name": "Belgian Grand Prix",
        "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2025",
        "location": "Spa-Francorchamps",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-07-27T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025132,
        "meeting_key": 202513,
        "meeting_name": "Belgian Grand Prix",
        "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2025",
        "location": "Spa-Francorchamps",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-07-26T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025133,
        "meeting_key": 202513,
        "meeting_name": "Belgian Grand Prix",
        "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2025",
        "location": "Spa-Francorchamps",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-07-26T09:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025141,
        "meeting_key": 202514,
        "meeting_name": "Hungarian Grand Prix",
        "meeting_official_name": "Formula 1 Hungarian Grand Prix 2025",
        "location": "Budapest",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-08-03T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025142,
        "meeting_key": 202514,
        "meeting_name": "Hungarian Grand Prix",
        "meeting_official_name": "Formula 1 Hungarian Grand Prix 2025",
        "location": "Budapest",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-08-02T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025151,
        "meeting_key": 202515,
        "meeting_name": "Dutch Grand Prix",
        "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2025",
        "location": "Zandvoort",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-08-31T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025152,
        "meeting_key": 202515,
        "meeting_name": "Dutch Grand Prix",
        "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2025",
        "location": "Zandvoort",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-08-30T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025161,
        "meeting_key": 202516,
        "meeting_name": "Italian Grand Prix",
        "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2025",
        "location": "Monza",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-09-07T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025162,
        "meeting_key": 202516,
        "meeting_name": "Italian Grand Prix",
        "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2025",
        "location": "Monza",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-09-06T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025171,
        "meeting_key": 202517,
        "meeting_name": "Azerbaijan Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Azerbaijan Grand Prix 2025",
        "location": "Baku",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-09-21T11:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025172,
        "meeting_key": 202517,
        "meeting_name": "Azerbaijan Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Azerbaijan Grand Prix 2025",
        "location": "Baku",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-09-20T11:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025181,
        "meeting_key": 202518,
        "meeting_name": "Singapore Grand Prix",
        "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2025",
        "location": "Singapore",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-10-05T12:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025182,
        "meeting_key": 202518,
        "meeting_name": "Singapore Grand Prix",
        "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2025",
        "location": "Singapore",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-10-04T12:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025191,
        "meeting_key": 202519,
        "meeting_name": "United States Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises United States Grand Prix 2025",
        "location": "Austin",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-10-19T19:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025192,
        "meeting_key": 202519,
        "meeting_name": "United States Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises United States Grand Prix 2025",
        "location": "Austin",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-10-18T19:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025193,
        "meeting_key": 202519,
        "meeting_name": "United States Grand Prix",
        "meeting_official_name": "Formula 1 MSC Cruises United States Grand Prix 2025",
        "location": "Austin",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-10-18T15:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025201,
        "meeting_key": 202520,
        "meeting_name": "Mexico City Grand Prix",
        "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2025",
        "location": "Mexico City",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-10-26T20:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025202,
        "meeting_key": 202520,
        "meeting_name": "Mexico City Grand Prix",
        "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2025",
        "location": "Mexico City",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-10-25T20:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025211,
        "meeting_key": 202521,
        "meeting_name": "Sao Paulo Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2025",
        "location": "Sao Paulo",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-11-09T17:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025212,
        "meeting_key": 202521,
        "meeting_name": "Sao Paulo Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2025",
        "location": "Sao Paulo",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-11-08T17:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025213,
        "meeting_key": 202521,
        "meeting_name": "Sao Paulo Grand Prix",
        "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2025",
        "location": "Sao Paulo",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-11-08T13:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025221,
        "meeting_key": 202522,
        "meeting_name": "Las Vegas Grand Prix",
        "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2025",
        "location": "Las Vegas",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-11-23T06:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025222,
        "meeting_key": 202522,
        "meeting_name": "Las Vegas Grand Prix",
        "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2025",
        "location": "Las Vegas",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-11-22T06:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025231,
        "meeting_key": 202523,
        "meeting_name": "Qatar Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2025",
        "location": "Lusail",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-11-30T16:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025232,
        "meeting_key": 202523,
        "meeting_name": "Qatar Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2025",
        "location": "Lusail",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-11-29T16:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025233,
        "meeting_key": 202523,
        "meeting_name": "Qatar Grand Prix",
        "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2025",
        "location": "Lusail",
        "session_name": "Sprint",
        "session_type": "Sprint",
        "date_start": "2025-11-29T12:00:00.000Z",
        "year": 2025
    },
    {
        "session_key": 2025241,
        "meeting_key": 202524,
        "meeting_name": "Abu Dhabi Grand Prix",
        "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2025",
        "location": "Yas Marina",
        "session_name": "Race",
        "session_type": "Race",
        "date_start": "2025-12-07T13:00:00Z",
        "year": 2025
    },
    {
        "session_key": 2025242,
        "meeting_key": 202524,
        "meeting_name": "Abu Dhabi Grand Prix",
        "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2025",
        "location": "Yas Marina",
        "session_name": "Qualifying",
        "session_type": "Qualifying",
        "date_start": "2025-12-06T13:00:00.000Z",
        "year": 2025
    }
],
  "2021": [
    {
      "session_key": 2021011,
      "meeting_key": 202101,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2021",
      "location": "Sakhir",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-03-28T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021012,
      "meeting_key": 202101,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2021",
      "location": "Sakhir",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-03-28T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021021,
      "meeting_key": 202102,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio del Made in Italy e dell'Emilia-Romagna 2021",
      "location": "Imola",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-04-18T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021022,
      "meeting_key": 202102,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio del Made in Italy e dell'Emilia-Romagna 2021",
      "location": "Imola",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-04-18T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021031,
      "meeting_key": 202103,
      "meeting_name": "Portuguese Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prémio de Portugal 2021",
      "location": "Portimao",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-05-02T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021032,
      "meeting_key": 202103,
      "meeting_name": "Portuguese Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prémio de Portugal 2021",
      "location": "Portimao",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-05-02T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021041,
      "meeting_key": 202104,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2021",
      "location": "Barcelona",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-05-09T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021042,
      "meeting_key": 202104,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2021",
      "location": "Barcelona",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-05-09T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021051,
      "meeting_key": 202105,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2021",
      "location": "Monaco",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-05-23T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021052,
      "meeting_key": 202105,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2021",
      "location": "Monaco",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-05-23T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021061,
      "meeting_key": 202106,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2021",
      "location": "Baku",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-06-06T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021062,
      "meeting_key": 202106,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2021",
      "location": "Baku",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-06-06T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021071,
      "meeting_key": 202107,
      "meeting_name": "French Grand Prix",
      "meeting_official_name": "Formula 1 Emirates Grand Prix de France 2021",
      "location": "Le Castellet",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-06-20T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021072,
      "meeting_key": 202107,
      "meeting_name": "French Grand Prix",
      "meeting_official_name": "Formula 1 Emirates Grand Prix de France 2021",
      "location": "Le Castellet",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-06-20T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021081,
      "meeting_key": 202108,
      "meeting_name": "Styrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis der Steiermark 2021",
      "location": "Spielberg",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-06-27T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021082,
      "meeting_key": 202108,
      "meeting_name": "Styrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis der Steiermark 2021",
      "location": "Spielberg",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-06-27T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021091,
      "meeting_key": 202109,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 BWT Grosser Preis von Österreich 2021",
      "location": "Spielberg",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-07-04T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021092,
      "meeting_key": 202109,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 BWT Grosser Preis von Österreich 2021",
      "location": "Spielberg",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-07-04T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021101,
      "meeting_key": 202110,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli British Grand Prix 2021",
      "location": "Silverstone",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-07-18T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021102,
      "meeting_key": 202110,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli British Grand Prix 2021",
      "location": "Silverstone",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-07-18T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021103,
      "meeting_key": 202110,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli British Grand Prix 2021",
      "location": "Silverstone",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2021-07-18T07:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021111,
      "meeting_key": 202111,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Magyar Nagydíj 2021",
      "location": "Budapest",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-08-01T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021112,
      "meeting_key": 202111,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Magyar Nagydíj 2021",
      "location": "Budapest",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-08-01T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021121,
      "meeting_key": 202112,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2021",
      "location": "Spa-Francorchamps",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-08-29T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021122,
      "meeting_key": 202112,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2021",
      "location": "Spa-Francorchamps",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-08-29T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021131,
      "meeting_key": 202113,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2021",
      "location": "Zandvoort",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-09-05T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021132,
      "meeting_key": 202113,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2021",
      "location": "Zandvoort",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-09-05T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021141,
      "meeting_key": 202114,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Gran Premio d'Italia 2021",
      "location": "Monza",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-09-12T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021142,
      "meeting_key": 202114,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Gran Premio d'Italia 2021",
      "location": "Monza",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-09-12T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021143,
      "meeting_key": 202114,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Gran Premio d'Italia 2021",
      "location": "Monza",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2021-09-12T07:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021151,
      "meeting_key": 202115,
      "meeting_name": "Russian Grand Prix",
      "meeting_official_name": "Formula 1 VTB Russian Grand Prix 2021",
      "location": "Sochi",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-09-26T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021152,
      "meeting_key": 202115,
      "meeting_name": "Russian Grand Prix",
      "meeting_official_name": "Formula 1 VTB Russian Grand Prix 2021",
      "location": "Sochi",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-09-26T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021161,
      "meeting_key": 202116,
      "meeting_name": "Turkish Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Turkish Grand Prix 2021",
      "location": "Istanbul",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-10-10T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021162,
      "meeting_key": 202116,
      "meeting_name": "Turkish Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Turkish Grand Prix 2021",
      "location": "Istanbul",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-10-10T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021171,
      "meeting_key": 202117,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Aramco United States Grand Prix 2021",
      "location": "Austin",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-10-24T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021172,
      "meeting_key": 202117,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Aramco United States Grand Prix 2021",
      "location": "Austin",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-10-24T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021181,
      "meeting_key": 202118,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2021",
      "location": "Mexico City",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-11-07T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021182,
      "meeting_key": 202118,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2021",
      "location": "Mexico City",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-11-07T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021191,
      "meeting_key": 202119,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2021",
      "location": "Sao Paulo",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-11-14T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021192,
      "meeting_key": 202119,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2021",
      "location": "Sao Paulo",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-11-14T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021193,
      "meeting_key": 202119,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2021",
      "location": "Sao Paulo",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2021-11-14T07:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021201,
      "meeting_key": 202120,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Ooredoo Qatar Grand Prix 2021",
      "location": "Lusail",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-11-21T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021202,
      "meeting_key": 202120,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Ooredoo Qatar Grand Prix 2021",
      "location": "Lusail",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-11-21T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021211,
      "meeting_key": 202121,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2021",
      "location": "Jeddah",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-12-05T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021212,
      "meeting_key": 202121,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2021",
      "location": "Jeddah",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-12-05T11:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021221,
      "meeting_key": 202122,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2021",
      "location": "Yas Marina",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2021-12-12T15:00:00Z",
      "year": 2021
    },
    {
      "session_key": 2021222,
      "meeting_key": 202122,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2021",
      "location": "Yas Marina",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2021-12-12T11:00:00Z",
      "year": 2021
    }
  ],
  "2022": [
    {
      "session_key": 2022011,
      "meeting_key": 202201,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2022",
      "location": "Sakhir",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-03-20T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022012,
      "meeting_key": 202201,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2022",
      "location": "Sakhir",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-03-20T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022021,
      "meeting_key": 202202,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2022",
      "location": "Jeddah",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-03-27T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022022,
      "meeting_key": 202202,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2022",
      "location": "Jeddah",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-03-27T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022031,
      "meeting_key": 202203,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Australian Grand Prix 2022",
      "location": "Melbourne",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-04-10T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022032,
      "meeting_key": 202203,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Australian Grand Prix 2022",
      "location": "Melbourne",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-04-10T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022041,
      "meeting_key": 202204,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Gran Premio del Made in Italy e dell'Emilia-Romagna 2022",
      "location": "Imola",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-04-24T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022042,
      "meeting_key": 202204,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Gran Premio del Made in Italy e dell'Emilia-Romagna 2022",
      "location": "Imola",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-04-24T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022043,
      "meeting_key": 202204,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Gran Premio del Made in Italy e dell'Emilia-Romagna 2022",
      "location": "Imola",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2022-04-24T07:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022051,
      "meeting_key": 202205,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2022",
      "location": "Miami",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-05-08T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022052,
      "meeting_key": 202205,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2022",
      "location": "Miami",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-05-08T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022061,
      "meeting_key": 202206,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio de España 2022",
      "location": "Barcelona",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-05-22T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022062,
      "meeting_key": 202206,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio de España 2022",
      "location": "Barcelona",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-05-22T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022071,
      "meeting_key": 202207,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2022",
      "location": "Monaco",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-05-29T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022072,
      "meeting_key": 202207,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2022",
      "location": "Monaco",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-05-29T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022081,
      "meeting_key": 202208,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2022",
      "location": "Baku",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-06-12T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022082,
      "meeting_key": 202208,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2022",
      "location": "Baku",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-06-12T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022091,
      "meeting_key": 202209,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2022",
      "location": "Montreal",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-06-19T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022092,
      "meeting_key": 202209,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2022",
      "location": "Montreal",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-06-19T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022101,
      "meeting_key": 202210,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo British Grand Prix 2022",
      "location": "Silverstone",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-07-03T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022102,
      "meeting_key": 202210,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo British Grand Prix 2022",
      "location": "Silverstone",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-07-03T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022111,
      "meeting_key": 202211,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2022",
      "location": "Spielberg",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-07-10T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022112,
      "meeting_key": 202211,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2022",
      "location": "Spielberg",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-07-10T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022113,
      "meeting_key": 202211,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2022",
      "location": "Spielberg",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2022-07-10T07:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022121,
      "meeting_key": 202212,
      "meeting_name": "French Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Grand Prix de France 2022",
      "location": "Le Castellet",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-07-24T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022122,
      "meeting_key": 202212,
      "meeting_name": "French Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Grand Prix de France 2022",
      "location": "Le Castellet",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-07-24T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022131,
      "meeting_key": 202213,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Magyar Nagydíj 2022",
      "location": "Budapest",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-07-31T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022132,
      "meeting_key": 202213,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Magyar Nagydíj 2022",
      "location": "Budapest",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-07-31T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022141,
      "meeting_key": 202214,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2022",
      "location": "Spa-Francorchamps",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-08-28T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022142,
      "meeting_key": 202214,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2022",
      "location": "Spa-Francorchamps",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-08-28T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022151,
      "meeting_key": 202215,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2022",
      "location": "Zandvoort",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-09-04T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022152,
      "meeting_key": 202215,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2022",
      "location": "Zandvoort",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-09-04T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022161,
      "meeting_key": 202216,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2022",
      "location": "Monza",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-09-11T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022162,
      "meeting_key": 202216,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2022",
      "location": "Monza",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-09-11T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022171,
      "meeting_key": 202217,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2022",
      "location": "Singapore",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-10-02T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022172,
      "meeting_key": 202217,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2022",
      "location": "Singapore",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-10-02T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022181,
      "meeting_key": 202218,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 Honda Japanese Grand Prix 2022",
      "location": "Suzuka",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-10-09T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022182,
      "meeting_key": 202218,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 Honda Japanese Grand Prix 2022",
      "location": "Suzuka",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-10-09T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022191,
      "meeting_key": 202219,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Aramco United States Grand Prix 2022",
      "location": "Austin",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-10-23T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022192,
      "meeting_key": 202219,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Aramco United States Grand Prix 2022",
      "location": "Austin",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-10-23T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022201,
      "meeting_key": 202220,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2022",
      "location": "Mexico City",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-10-30T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022202,
      "meeting_key": 202220,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2022",
      "location": "Mexico City",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-10-30T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022211,
      "meeting_key": 202221,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2022",
      "location": "Sao Paulo",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-11-13T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022212,
      "meeting_key": 202221,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2022",
      "location": "Sao Paulo",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-11-13T11:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022213,
      "meeting_key": 202221,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Grande Prêmio de São Paulo 2022",
      "location": "Sao Paulo",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2022-11-13T07:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022221,
      "meeting_key": 202222,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2022",
      "location": "Yas Marina",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2022-11-20T15:00:00Z",
      "year": 2022
    },
    {
      "session_key": 2022222,
      "meeting_key": 202222,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2022",
      "location": "Yas Marina",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2022-11-20T11:00:00Z",
      "year": 2022
    }
  ],
  "2023": [
    {
      "session_key": 2023011,
      "meeting_key": 202301,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2023",
      "location": "Sakhir",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-03-05T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023012,
      "meeting_key": 202301,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2023",
      "location": "Sakhir",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-03-05T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023021,
      "meeting_key": 202302,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2023",
      "location": "Jeddah",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-03-19T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023022,
      "meeting_key": 202302,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2023",
      "location": "Jeddah",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-03-19T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023031,
      "meeting_key": 202303,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Australian Grand Prix 2023",
      "location": "Melbourne",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-04-02T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023032,
      "meeting_key": 202303,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Australian Grand Prix 2023",
      "location": "Melbourne",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-04-02T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023041,
      "meeting_key": 202304,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2023",
      "location": "Baku",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-04-30T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023042,
      "meeting_key": 202304,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2023",
      "location": "Baku",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-04-30T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023043,
      "meeting_key": 202304,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Azerbaijan Grand Prix 2023",
      "location": "Baku",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-04-30T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023051,
      "meeting_key": 202305,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2023",
      "location": "Miami",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-05-07T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023052,
      "meeting_key": 202305,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2023",
      "location": "Miami",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-05-07T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023061,
      "meeting_key": 202306,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2023",
      "location": "Monaco",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-05-28T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023062,
      "meeting_key": 202306,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2023",
      "location": "Monaco",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-05-28T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023071,
      "meeting_key": 202307,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 AWS Gran Premio de España 2023",
      "location": "Barcelona",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-06-04T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023072,
      "meeting_key": 202307,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 AWS Gran Premio de España 2023",
      "location": "Barcelona",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-06-04T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023081,
      "meeting_key": 202308,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Grand Prix du Canada 2023",
      "location": "Montreal",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-06-18T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023082,
      "meeting_key": 202308,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Grand Prix du Canada 2023",
      "location": "Montreal",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-06-18T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023091,
      "meeting_key": 202309,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2023",
      "location": "Spielberg",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-07-02T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023092,
      "meeting_key": 202309,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2023",
      "location": "Spielberg",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-07-02T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023093,
      "meeting_key": 202309,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Grosser Preis von Österreich 2023",
      "location": "Spielberg",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-07-02T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023101,
      "meeting_key": 202310,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Aramco British Grand Prix 2023",
      "location": "Silverstone",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-07-09T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023102,
      "meeting_key": 202310,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Aramco British Grand Prix 2023",
      "location": "Silverstone",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-07-09T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023111,
      "meeting_key": 202311,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Hungarian Grand Prix 2023",
      "location": "Budapest",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-07-23T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023112,
      "meeting_key": 202311,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Hungarian Grand Prix 2023",
      "location": "Budapest",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-07-23T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023121,
      "meeting_key": 202312,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Belgian Grand Prix 2023",
      "location": "Spa-Francorchamps",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-07-30T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023122,
      "meeting_key": 202312,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Belgian Grand Prix 2023",
      "location": "Spa-Francorchamps",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-07-30T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023123,
      "meeting_key": 202312,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Belgian Grand Prix 2023",
      "location": "Spa-Francorchamps",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-07-30T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023131,
      "meeting_key": 202313,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2023",
      "location": "Zandvoort",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-08-27T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023132,
      "meeting_key": 202313,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2023",
      "location": "Zandvoort",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-08-27T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023141,
      "meeting_key": 202314,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2023",
      "location": "Monza",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-09-03T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023142,
      "meeting_key": 202314,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2023",
      "location": "Monza",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-09-03T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023151,
      "meeting_key": 202315,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2023",
      "location": "Singapore",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-09-17T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023152,
      "meeting_key": 202315,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2023",
      "location": "Singapore",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-09-17T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023161,
      "meeting_key": 202316,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Japanese Grand Prix 2023",
      "location": "Suzuka",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-09-24T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023162,
      "meeting_key": 202316,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Japanese Grand Prix 2023",
      "location": "Suzuka",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-09-24T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023171,
      "meeting_key": 202317,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2023",
      "location": "Lusail",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-10-08T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023172,
      "meeting_key": 202317,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2023",
      "location": "Lusail",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-10-08T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023173,
      "meeting_key": 202317,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2023",
      "location": "Lusail",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-10-08T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023181,
      "meeting_key": 202318,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo United States Grand Prix 2023",
      "location": "Austin",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-10-22T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023182,
      "meeting_key": 202318,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo United States Grand Prix 2023",
      "location": "Austin",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-10-22T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023183,
      "meeting_key": 202318,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo United States Grand Prix 2023",
      "location": "Austin",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-10-22T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023191,
      "meeting_key": 202319,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2023",
      "location": "Mexico City",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-10-29T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023192,
      "meeting_key": 202319,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2023",
      "location": "Mexico City",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-10-29T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023201,
      "meeting_key": 202320,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Grande Prêmio de São Paulo 2023",
      "location": "Sao Paulo",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-11-05T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023202,
      "meeting_key": 202320,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Grande Prêmio de São Paulo 2023",
      "location": "Sao Paulo",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-11-05T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023203,
      "meeting_key": 202320,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Grande Prêmio de São Paulo 2023",
      "location": "Sao Paulo",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2023-11-05T07:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023211,
      "meeting_key": 202321,
      "meeting_name": "Las Vegas Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2023",
      "location": "Las Vegas",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-11-18T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023212,
      "meeting_key": 202321,
      "meeting_name": "Las Vegas Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2023",
      "location": "Las Vegas",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-11-18T11:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023221,
      "meeting_key": 202322,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2023",
      "location": "Yas Marina",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2023-11-26T15:00:00Z",
      "year": 2023
    },
    {
      "session_key": 2023222,
      "meeting_key": 202322,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2023",
      "location": "Yas Marina",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2023-11-26T11:00:00Z",
      "year": 2023
    }
  ],
  "2024": [
    {
      "session_key": 9161,
      "meeting_key": 1234,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2024",
      "location": "Sakhir",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-03-02T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 9162,
      "meeting_key": 1234,
      "meeting_name": "Bahrain Grand Prix",
      "meeting_official_name": "Formula 1 Gulf Air Bahrain Grand Prix 2024",
      "location": "Sakhir",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-03-02T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024021,
      "meeting_key": 202402,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2024",
      "location": "Jeddah",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-03-09T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024022,
      "meeting_key": 202402,
      "meeting_name": "Saudi Arabian Grand Prix",
      "meeting_official_name": "Formula 1 STC Saudi Arabian Grand Prix 2024",
      "location": "Jeddah",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-03-09T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024031,
      "meeting_key": 202403,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Australian Grand Prix 2024",
      "location": "Melbourne",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-03-24T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024032,
      "meeting_key": 202403,
      "meeting_name": "Australian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Australian Grand Prix 2024",
      "location": "Melbourne",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-03-24T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 9163,
      "meeting_key": 5678,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Japanese Grand Prix 2024",
      "location": "Suzuka",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-04-07T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024042,
      "meeting_key": 5678,
      "meeting_name": "Japanese Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Japanese Grand Prix 2024",
      "location": "Suzuka",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-04-07T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024051,
      "meeting_key": 202405,
      "meeting_name": "Chinese Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2024",
      "location": "Shanghai",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-04-21T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024052,
      "meeting_key": 202405,
      "meeting_name": "Chinese Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2024",
      "location": "Shanghai",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-04-21T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024053,
      "meeting_key": 202405,
      "meeting_name": "Chinese Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Chinese Grand Prix 2024",
      "location": "Shanghai",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-04-21T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024061,
      "meeting_key": 202406,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2024",
      "location": "Miami",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-05-05T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024062,
      "meeting_key": 202406,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2024",
      "location": "Miami",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-05-05T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024063,
      "meeting_key": 202406,
      "meeting_name": "Miami Grand Prix",
      "meeting_official_name": "Formula 1 Crypto.com Miami Grand Prix 2024",
      "location": "Miami",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-05-05T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024071,
      "meeting_key": 202407,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Gran Premio del Made in Italy e dell'Emilia-Romagna 2024",
      "location": "Imola",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-05-19T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024072,
      "meeting_key": 202407,
      "meeting_name": "Emilia Romagna Grand Prix",
      "meeting_official_name": "Formula 1 MSC Cruises Gran Premio del Made in Italy e dell'Emilia-Romagna 2024",
      "location": "Imola",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-05-19T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024081,
      "meeting_key": 202408,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2024",
      "location": "Monaco",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-05-26T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024082,
      "meeting_key": 202408,
      "meeting_name": "Monaco Grand Prix",
      "meeting_official_name": "Formula 1 Grand Prix de Monaco 2024",
      "location": "Monaco",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-05-26T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024091,
      "meeting_key": 202409,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2024",
      "location": "Montreal",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-06-09T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024092,
      "meeting_key": 202409,
      "meeting_name": "Canadian Grand Prix",
      "meeting_official_name": "Formula 1 AWS Grand Prix du Canada 2024",
      "location": "Montreal",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-06-09T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024101,
      "meeting_key": 202410,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2024",
      "location": "Barcelona",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-06-23T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024102,
      "meeting_key": 202410,
      "meeting_name": "Spanish Grand Prix",
      "meeting_official_name": "Formula 1 Aramco Gran Premio de España 2024",
      "location": "Barcelona",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-06-23T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024111,
      "meeting_key": 202411,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2024",
      "location": "Spielberg",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-06-30T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024112,
      "meeting_key": 202411,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2024",
      "location": "Spielberg",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-06-30T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024113,
      "meeting_key": 202411,
      "meeting_name": "Austrian Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Austrian Grand Prix 2024",
      "location": "Spielberg",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-06-30T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024121,
      "meeting_key": 202412,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways British Grand Prix 2024",
      "location": "Silverstone",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-07-07T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024122,
      "meeting_key": 202412,
      "meeting_name": "British Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways British Grand Prix 2024",
      "location": "Silverstone",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-07-07T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024131,
      "meeting_key": 202413,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Hungarian Grand Prix 2024",
      "location": "Budapest",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-07-21T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024132,
      "meeting_key": 202413,
      "meeting_name": "Hungarian Grand Prix",
      "meeting_official_name": "Formula 1 Hungarian Grand Prix 2024",
      "location": "Budapest",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-07-21T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024141,
      "meeting_key": 202414,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2024",
      "location": "Spa-Francorchamps",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-07-28T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024142,
      "meeting_key": 202414,
      "meeting_name": "Belgian Grand Prix",
      "meeting_official_name": "Formula 1 Rolex Belgian Grand Prix 2024",
      "location": "Spa-Francorchamps",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-07-28T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024151,
      "meeting_key": 202415,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2024",
      "location": "Zandvoort",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-08-25T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024152,
      "meeting_key": 202415,
      "meeting_name": "Dutch Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Dutch Grand Prix 2024",
      "location": "Zandvoort",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-08-25T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024161,
      "meeting_key": 202416,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2024",
      "location": "Monza",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-09-01T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024162,
      "meeting_key": 202416,
      "meeting_name": "Italian Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli Gran Premio d'Italia 2024",
      "location": "Monza",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-09-01T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024171,
      "meeting_key": 202417,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Azerbaijan Grand Prix 2024",
      "location": "Baku",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-09-15T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024172,
      "meeting_key": 202417,
      "meeting_name": "Azerbaijan Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Azerbaijan Grand Prix 2024",
      "location": "Baku",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-09-15T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024181,
      "meeting_key": 202418,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2024",
      "location": "Singapore",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-09-22T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024182,
      "meeting_key": 202418,
      "meeting_name": "Singapore Grand Prix",
      "meeting_official_name": "Formula 1 Singapore Airlines Singapore Grand Prix 2024",
      "location": "Singapore",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-09-22T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024191,
      "meeting_key": 202419,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli United States Grand Prix 2024",
      "location": "Austin",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-10-20T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024192,
      "meeting_key": 202419,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli United States Grand Prix 2024",
      "location": "Austin",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-10-20T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024193,
      "meeting_key": 202419,
      "meeting_name": "United States Grand Prix",
      "meeting_official_name": "Formula 1 Pirelli United States Grand Prix 2024",
      "location": "Austin",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-10-20T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024201,
      "meeting_key": 202420,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2024",
      "location": "Mexico City",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-10-27T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024202,
      "meeting_key": 202420,
      "meeting_name": "Mexico City Grand Prix",
      "meeting_official_name": "Formula 1 Gran Premio de la Ciudad de México 2024",
      "location": "Mexico City",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-10-27T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024211,
      "meeting_key": 202421,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2024",
      "location": "Sao Paulo",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-11-03T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024212,
      "meeting_key": 202421,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2024",
      "location": "Sao Paulo",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-11-03T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024213,
      "meeting_key": 202421,
      "meeting_name": "Sao Paulo Grand Prix",
      "meeting_official_name": "Formula 1 Lenovo Grande Prêmio de São Paulo 2024",
      "location": "Sao Paulo",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-11-03T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024221,
      "meeting_key": 202422,
      "meeting_name": "Las Vegas Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2024",
      "location": "Las Vegas",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-11-23T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024222,
      "meeting_key": 202422,
      "meeting_name": "Las Vegas Grand Prix",
      "meeting_official_name": "Formula 1 Heineken Silver Las Vegas Grand Prix 2024",
      "location": "Las Vegas",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-11-23T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024231,
      "meeting_key": 202423,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2024",
      "location": "Lusail",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-12-01T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024232,
      "meeting_key": 202423,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2024",
      "location": "Lusail",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-12-01T11:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024233,
      "meeting_key": 202423,
      "meeting_name": "Qatar Grand Prix",
      "meeting_official_name": "Formula 1 Qatar Airways Qatar Grand Prix 2024",
      "location": "Lusail",
      "session_name": "Sprint",
      "session_type": "Sprint",
      "date_start": "2024-12-01T07:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024241,
      "meeting_key": 202424,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2024",
      "location": "Yas Marina",
      "session_name": "Race",
      "session_type": "Race",
      "date_start": "2024-12-08T15:00:00Z",
      "year": 2024
    },
    {
      "session_key": 2024242,
      "meeting_key": 202424,
      "meeting_name": "Abu Dhabi Grand Prix",
      "meeting_official_name": "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2024",
      "location": "Yas Marina",
      "session_name": "Qualifying",
      "session_type": "Qualifying",
      "date_start": "2024-12-08T11:00:00Z",
      "year": 2024
    }
  ]
};

export const F1_CATALOG_ALL_SESSIONS: Session[] = [
  ...(F1_CATALOG_SESSIONS_BY_YEAR[2025] ?? []),
  ...(F1_CATALOG_SESSIONS_BY_YEAR[2024] ?? []),
  ...(F1_CATALOG_SESSIONS_BY_YEAR[2023] ?? []),
  ...(F1_CATALOG_SESSIONS_BY_YEAR[2022] ?? []),
  ...(F1_CATALOG_SESSIONS_BY_YEAR[2021] ?? []),
];

export const DRIVERS_2025: Driver[] = [
  { driver_number: 1, name_acronym: 'VER', first_name: 'Max', last_name: 'Verstappen', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 30, name_acronym: 'LAW', first_name: 'Liam', last_name: 'Lawson', full_name: 'Liam Lawson', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 4, name_acronym: 'NOR', first_name: 'Lando', last_name: 'Norris', full_name: 'Lando Norris', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 81, name_acronym: 'PIA', first_name: 'Oscar', last_name: 'Piastri', full_name: 'Oscar Piastri', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles', last_name: 'Leclerc', full_name: 'Charles Leclerc', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis', last_name: 'Hamilton', full_name: 'Lewis Hamilton', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 63, name_acronym: 'RUS', first_name: 'George', last_name: 'Russell', full_name: 'George Russell', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 12, name_acronym: 'ANT', first_name: 'Andrea Kimi', last_name: 'Antonelli', full_name: 'Andrea Kimi Antonelli', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando', last_name: 'Alonso', full_name: 'Fernando Alonso', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 18, name_acronym: 'STR', first_name: 'Lance', last_name: 'Stroll', full_name: 'Lance Stroll', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 10, name_acronym: 'GAS', first_name: 'Pierre', last_name: 'Gasly', full_name: 'Pierre Gasly', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 7, name_acronym: 'DOO', first_name: 'Jack', last_name: 'Doohan', full_name: 'Jack Doohan', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 23, name_acronym: 'ALB', first_name: 'Alexander', last_name: 'Albon', full_name: 'Alexander Albon', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos', last_name: 'Sainz', full_name: 'Carlos Sainz', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 22, name_acronym: 'TSU', first_name: 'Yuki', last_name: 'Tsunoda', full_name: 'Yuki Tsunoda', team_name: 'RB', team_colour: '6692FF' },
  { driver_number: 6, name_acronym: 'HAD', first_name: 'Isack', last_name: 'Hadjar', full_name: 'Isack Hadjar', team_name: 'RB', team_colour: '6692FF' },
  { driver_number: 31, name_acronym: 'OCO', first_name: 'Esteban', last_name: 'Ocon', full_name: 'Esteban Ocon', team_name: 'Haas', team_colour: 'B6BABD' },
  { driver_number: 87, name_acronym: 'BEA', first_name: 'Oliver', last_name: 'Bearman', full_name: 'Oliver Bearman', team_name: 'Haas', team_colour: 'B6BABD' },
  { driver_number: 27, name_acronym: 'HUL', first_name: 'Nico', last_name: 'Hulkenberg', full_name: 'Nico Hulkenberg', team_name: 'Kick Sauber', team_colour: '52E252' },
  { driver_number: 5, name_acronym: 'BOR', first_name: 'Gabriel', last_name: 'Bortoleto', full_name: 'Gabriel Bortoleto', team_name: 'Kick Sauber', team_colour: '52E252' },
];

export const DRIVERS_2024: Driver[] = [
  { driver_number: 1, name_acronym: 'VER', first_name: 'Max', last_name: 'Verstappen', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio', last_name: 'Perez', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles', last_name: 'Leclerc', full_name: 'Charles Leclerc', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos', last_name: 'Sainz', full_name: 'Carlos Sainz', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 4, name_acronym: 'NOR', first_name: 'Lando', last_name: 'Norris', full_name: 'Lando Norris', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 81, name_acronym: 'PIA', first_name: 'Oscar', last_name: 'Piastri', full_name: 'Oscar Piastri', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis', last_name: 'Hamilton', full_name: 'Lewis Hamilton', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 63, name_acronym: 'RUS', first_name: 'George', last_name: 'Russell', full_name: 'George Russell', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando', last_name: 'Alonso', full_name: 'Fernando Alonso', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 18, name_acronym: 'STR', first_name: 'Lance', last_name: 'Stroll', full_name: 'Lance Stroll', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 10, name_acronym: 'GAS', first_name: 'Pierre', last_name: 'Gasly', full_name: 'Pierre Gasly', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 31, name_acronym: 'OCO', first_name: 'Esteban', last_name: 'Ocon', full_name: 'Esteban Ocon', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 23, name_acronym: 'ALB', first_name: 'Alexander', last_name: 'Albon', full_name: 'Alexander Albon', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 2, name_acronym: 'SAR', first_name: 'Logan', last_name: 'Sargeant', full_name: 'Logan Sargeant', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 22, name_acronym: 'TSU', first_name: 'Yuki', last_name: 'Tsunoda', full_name: 'Yuki Tsunoda', team_name: 'RB', team_colour: '6692FF' },
  { driver_number: 3, name_acronym: 'RIC', first_name: 'Daniel', last_name: 'Ricciardo', full_name: 'Daniel Ricciardo', team_name: 'RB', team_colour: '6692FF' },
  { driver_number: 77, name_acronym: 'BOT', first_name: 'Valtteri', last_name: 'Bottas', full_name: 'Valtteri Bottas', team_name: 'Kick Sauber', team_colour: '52E252' },
  { driver_number: 24, name_acronym: 'ZHO', first_name: 'Guanyu', last_name: 'Zhou', full_name: 'Guanyu Zhou', team_name: 'Kick Sauber', team_colour: '52E252' },
  { driver_number: 27, name_acronym: 'HUL', first_name: 'Nico', last_name: 'Hulkenberg', full_name: 'Nico Hulkenberg', team_name: 'Haas', team_colour: 'B6BABD' },
  { driver_number: 20, name_acronym: 'MAG', first_name: 'Kevin', last_name: 'Magnussen', full_name: 'Kevin Magnussen', team_name: 'Haas', team_colour: 'B6BABD' },
];

export const DRIVERS_2023: Driver[] = [
  ...DRIVERS_2024.map(d => {
    if (d.team_name === 'RB') return { ...d, team_name: 'AlphaTauri', team_colour: '5E8FAA' };
    if (d.team_name === 'Kick Sauber') return { ...d, team_name: 'Alfa Romeo', team_colour: 'C92D4B' };
    return d;
  }),
];

export const DRIVERS_2022: Driver[] = [
  { driver_number: 1, name_acronym: 'VER', first_name: 'Max', last_name: 'Verstappen', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio', last_name: 'Perez', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles', last_name: 'Leclerc', full_name: 'Charles Leclerc', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos', last_name: 'Sainz', full_name: 'Carlos Sainz', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis', last_name: 'Hamilton', full_name: 'Lewis Hamilton', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 63, name_acronym: 'RUS', first_name: 'George', last_name: 'Russell', full_name: 'George Russell', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 4, name_acronym: 'NOR', first_name: 'Lando', last_name: 'Norris', full_name: 'Lando Norris', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 3, name_acronym: 'RIC', first_name: 'Daniel', last_name: 'Ricciardo', full_name: 'Daniel Ricciardo', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando', last_name: 'Alonso', full_name: 'Fernando Alonso', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 31, name_acronym: 'OCO', first_name: 'Esteban', last_name: 'Ocon', full_name: 'Esteban Ocon', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 10, name_acronym: 'GAS', first_name: 'Pierre', last_name: 'Gasly', full_name: 'Pierre Gasly', team_name: 'AlphaTauri', team_colour: '5E8FAA' },
  { driver_number: 22, name_acronym: 'TSU', first_name: 'Yuki', last_name: 'Tsunoda', full_name: 'Yuki Tsunoda', team_name: 'AlphaTauri', team_colour: '5E8FAA' },
  { driver_number: 5, name_acronym: 'VET', first_name: 'Sebastian', last_name: 'Vettel', full_name: 'Sebastian Vettel', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 18, name_acronym: 'STR', first_name: 'Lance', last_name: 'Stroll', full_name: 'Lance Stroll', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 77, name_acronym: 'BOT', first_name: 'Valtteri', last_name: 'Bottas', full_name: 'Valtteri Bottas', team_name: 'Alfa Romeo', team_colour: 'C92D4B' },
  { driver_number: 24, name_acronym: 'ZHO', first_name: 'Guanyu', last_name: 'Zhou', full_name: 'Guanyu Zhou', team_name: 'Alfa Romeo', team_colour: 'C92D4B' },
  { driver_number: 23, name_acronym: 'ALB', first_name: 'Alexander', last_name: 'Albon', full_name: 'Alexander Albon', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 6, name_acronym: 'LAT', first_name: 'Nicholas', last_name: 'Latifi', full_name: 'Nicholas Latifi', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 20, name_acronym: 'MAG', first_name: 'Kevin', last_name: 'Magnussen', full_name: 'Kevin Magnussen', team_name: 'Haas', team_colour: 'B6BABD' },
  { driver_number: 47, name_acronym: 'MSC', first_name: 'Mick', last_name: 'Schumacher', full_name: 'Mick Schumacher', team_name: 'Haas', team_colour: 'B6BABD' },
];

export const DRIVERS_2021: Driver[] = [
  { driver_number: 33, name_acronym: 'VER', first_name: 'Max', last_name: 'Verstappen', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio', last_name: 'Perez', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', team_colour: '3671C2' },
  { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis', last_name: 'Hamilton', full_name: 'Lewis Hamilton', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 77, name_acronym: 'BOT', first_name: 'Valtteri', last_name: 'Bottas', full_name: 'Valtteri Bottas', team_name: 'Mercedes', team_colour: '00A19B' },
  { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles', last_name: 'Leclerc', full_name: 'Charles Leclerc', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos', last_name: 'Sainz', full_name: 'Carlos Sainz', team_name: 'Ferrari', team_colour: 'E80020' },
  { driver_number: 4, name_acronym: 'NOR', first_name: 'Lando', last_name: 'Norris', full_name: 'Lando Norris', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 3, name_acronym: 'RIC', first_name: 'Daniel', last_name: 'Ricciardo', full_name: 'Daniel Ricciardo', team_name: 'McLaren', team_colour: 'FF8000' },
  { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando', last_name: 'Alonso', full_name: 'Fernando Alonso', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 31, name_acronym: 'OCO', first_name: 'Esteban', last_name: 'Ocon', full_name: 'Esteban Ocon', team_name: 'Alpine', team_colour: '0093CC' },
  { driver_number: 10, name_acronym: 'GAS', first_name: 'Pierre', last_name: 'Gasly', full_name: 'Pierre Gasly', team_name: 'AlphaTauri', team_colour: '5E8FAA' },
  { driver_number: 22, name_acronym: 'TSU', first_name: 'Yuki', last_name: 'Tsunoda', full_name: 'Yuki Tsunoda', team_name: 'AlphaTauri', team_colour: '5E8FAA' },
  { driver_number: 5, name_acronym: 'VET', first_name: 'Sebastian', last_name: 'Vettel', full_name: 'Sebastian Vettel', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 18, name_acronym: 'STR', first_name: 'Lance', last_name: 'Stroll', full_name: 'Lance Stroll', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 63, name_acronym: 'RUS', first_name: 'George', last_name: 'Russell', full_name: 'George Russell', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 6, name_acronym: 'LAT', first_name: 'Nicholas', last_name: 'Latifi', full_name: 'Nicholas Latifi', team_name: 'Williams', team_colour: '64C4FF' },
  { driver_number: 7, name_acronym: 'RAI', first_name: 'Kimi', last_name: 'Raikkonen', full_name: 'Kimi Raikkonen', team_name: 'Alfa Romeo', team_colour: 'C92D4B' },
  { driver_number: 99, name_acronym: 'GIO', first_name: 'Antonio', last_name: 'Giovinazzi', full_name: 'Antonio Giovinazzi', team_name: 'Alfa Romeo', team_colour: 'C92D4B' },
  { driver_number: 47, name_acronym: 'MSC', first_name: 'Mick', last_name: 'Schumacher', full_name: 'Mick Schumacher', team_name: 'Haas', team_colour: 'B6BABD' },
  { driver_number: 9, name_acronym: 'MAZ', first_name: 'Nikita', last_name: 'Mazepin', full_name: 'Nikita Mazepin', team_name: 'Haas', team_colour: 'B6BABD' },
];

/** Retrieve all catalog sessions for a given year */
export function getCatalogSessionsForYear(year: number): Session[] {
  return F1_CATALOG_SESSIONS_BY_YEAR[year] ?? F1_CATALOG_SESSIONS_BY_YEAR[2025] ?? F1_CATALOG_SESSIONS_BY_YEAR[2024] ?? [];
}

/** Retrieve starting drivers for a given season */
export function getDriversForYear(year: number): Driver[] {
  if (year === 2021) return DRIVERS_2021;
  if (year === 2022) return DRIVERS_2022;
  if (year === 2023) return DRIVERS_2023;
  if (year === 2025) return DRIVERS_2025;
  return DRIVERS_2024;
}

/** Generate realistic stints for all drivers in a race session */
export function generateCatalogStints(
  drivers: Driver[],
  totalLaps: number = 57,
  pit1Lap?: number,
  pit2Lap?: number
): Stint[] {
  const stints: Stint[] = [];
  const defaultP1 = pit1Lap ?? Math.round(totalLaps * 0.32);
  const defaultP2 = pit2Lap ?? Math.round(totalLaps * 0.65);

  drivers.forEach((d, idx) => {
    const isOneStop = idx % 3 === 0;
    if (isOneStop) {
      const p1 = Math.round(totalLaps * 0.44) + (idx % 3) - 1;
      stints.push({
        driver_number: d.driver_number,
        stint_number: 1,
        lap_start: 1,
        lap_end: p1,
        compound: 'MEDIUM',
        tyre_age_at_start: 0,
      });
      stints.push({
        driver_number: d.driver_number,
        stint_number: 2,
        lap_start: p1 + 1,
        lap_end: totalLaps,
        compound: 'HARD',
        tyre_age_at_start: 0,
      });
    } else {
      const p1 = Math.max(8, defaultP1 + (idx % 4) - 2);
      const p2 = Math.min(totalLaps - 5, defaultP2 + (idx % 4) - 2);
      stints.push({
        driver_number: d.driver_number,
        stint_number: 1,
        lap_start: 1,
        lap_end: p1,
        compound: 'SOFT',
        tyre_age_at_start: 0,
      });
      stints.push({
        driver_number: d.driver_number,
        stint_number: 2,
        lap_start: p1 + 1,
        lap_end: p2,
        compound: 'HARD',
        tyre_age_at_start: 0,
      });
      stints.push({
        driver_number: d.driver_number,
        stint_number: 3,
        lap_start: p2 + 1,
        lap_end: totalLaps,
        compound: idx % 2 === 0 ? 'SOFT' : 'HARD',
        tyre_age_at_start: 0,
      });
    }
  });
  return stints;
}

/** Generate standard race control messages */
export function generateCatalogRaceControl(sessionKey?: number): RaceControlMessage[] {
  return [
    { date: '2024-03-02T15:00:00.000Z', lap_number: 1, category: 'Flag', flag: 'GREEN', message: 'TRACK CLEAR - GREEN LIGHT' },
    { date: '2024-03-02T15:20:00.000Z', lap_number: 12, category: 'CarEvent', flag: null, message: 'TURN 4 INCIDENT INVOLVING CARS 18 AND 23 UNDER INVESTIGATION' },
    { date: '2024-03-02T15:35:00.000Z', lap_number: 22, category: 'SafetyCar', flag: 'YELLOW', message: 'VIRTUAL SAFETY CAR DEPLOYED' },
    { date: '2024-03-02T15:37:30.000Z', lap_number: 23, category: 'SafetyCar', flag: 'GREEN', message: 'VIRTUAL SAFETY CAR ENDING - TRACK CLEAR' },
    { date: '2024-03-02T16:32:00.000Z', lap_number: 57, category: 'Flag', flag: 'CHEQUERED', message: 'CHEQUERED FLAG' },
  ];
}
