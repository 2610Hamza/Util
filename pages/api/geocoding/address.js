/**
 * API pour convertir une adresse en coordonnées GPS
 * GET: ?address=Paris
 * Utilise l'API Nominatim (OpenStreetMap) - gratuite, pas de clé requise
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Paramètre address requis' });
  }

  try {
    // Utiliser Nominatim (OpenStreetMap) - gratuit
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Util-App/1.0' // Nominatim requiert un User-Agent
      }
    });

    if (!response.ok) {
      throw new Error('Erreur API de géocodage');
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: 'Adresse introuvable' });
    }

    const result = data[0];

    return res.status(200).json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village || address,
      country: result.address?.country || 'France',
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    
    // Fallback : retourner des coordonnées par défaut (Paris)
    return res.status(200).json({
      lat: 48.8566,
      lng: 2.3522,
      displayName: address,
      city: address,
      country: 'France',
      fallback: true,
      message: 'Coordonnées approximatives'
    });
  }
}