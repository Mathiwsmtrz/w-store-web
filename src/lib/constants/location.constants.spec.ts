import {
  LOCATION_TREE,
  COUNTRY_OPTIONS,
  getStatesByCountry,
  getCitiesByCountryAndState,
  type SupportedCountry,
} from './location.constants'

describe('location.constants', () => {
  describe('LOCATION_TREE', () => {
    it('has Colombia and United States', () => {
      expect(LOCATION_TREE.map((l) => l.country)).toContain('Colombia')
      expect(LOCATION_TREE.map((l) => l.country)).toContain('United States')
    })
  })

  describe('COUNTRY_OPTIONS', () => {
    it('returns list of countries', () => {
      expect(COUNTRY_OPTIONS).toContain('Colombia')
      expect(COUNTRY_OPTIONS).toContain('United States')
    })
  })

  describe('getStatesByCountry', () => {
    it('returns states for Colombia', () => {
      const states = getStatesByCountry('Colombia')
      expect(states).toContain('Antioquia')
      expect(states).toContain('Bogota D.C.')
    })

    it('returns states for United States', () => {
      const states = getStatesByCountry('United States')
      expect(states).toContain('California')
      expect(states).toContain('Texas')
    })

    it('returns empty array for unknown country', () => {
      expect(getStatesByCountry('Unknown')).toEqual([])
    })
  })

  describe('getCitiesByCountryAndState', () => {
    it('returns cities for Colombia Antioquia', () => {
      const cities = getCitiesByCountryAndState('Colombia', 'Antioquia')
      expect(cities).toContain('Medellin')
      expect(cities).toContain('Bello')
    })

    it('returns cities for United States California', () => {
      const cities = getCitiesByCountryAndState('United States', 'California')
      expect(cities).toContain('Los Angeles')
    })

    it('returns empty array for unknown country', () => {
      expect(getCitiesByCountryAndState('Unknown', 'State')).toEqual([])
    })

    it('returns empty array for unknown state', () => {
      expect(getCitiesByCountryAndState('Colombia', 'Unknown')).toEqual([])
    })
  })

  describe('SupportedCountry type', () => {
    it('accepts valid country', () => {
      const country: SupportedCountry = 'Colombia'
      expect(country).toBe('Colombia')
    })
  })
})
