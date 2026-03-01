export const LOCATION_TREE = [
  {
    country: 'Colombia',
    states: [
      { state: 'Antioquia', cities: ['Medellin', 'Bello', 'Envigado'] },
      { state: 'Atlantico', cities: ['Barranquilla', 'Soledad', 'Puerto Colombia'] },
      { state: 'Bogota D.C.', cities: ['Bogota'] },
      { state: 'Bolivar', cities: ['Cartagena', 'Turbaco', 'Magangue'] },
      { state: 'Cundinamarca', cities: ['Soacha', 'Chia', 'Zipaquira'] },
      { state: 'Santander', cities: ['Bucaramanga', 'Floridablanca', 'Giron'] },
      { state: 'Valle del Cauca', cities: ['Cali', 'Palmira', 'Buenaventura'] },
    ],
  },
  {
    country: 'United States',
    states: [
      { state: 'California', cities: ['Los Angeles', 'San Diego', 'San Francisco'] },
      { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa'] },
      { state: 'Illinois', cities: ['Chicago', 'Springfield', 'Naperville'] },
      { state: 'New York', cities: ['New York City', 'Buffalo', 'Albany'] },
      { state: 'Texas', cities: ['Houston', 'Austin', 'Dallas'] },
    ],
  },
] as const

export type SupportedCountry = (typeof LOCATION_TREE)[number]['country']

export const COUNTRY_OPTIONS = LOCATION_TREE.map((location) => location.country)

export function getStatesByCountry(country: string): string[] {
  const states =
    LOCATION_TREE.find((location) => location.country === country)?.states.map(
      (state) => state.state,
    ) ?? []

  return [...states]
}

export function getCitiesByCountryAndState(country: string, state: string): string[] {
  const countryNode = LOCATION_TREE.find((location) => location.country === country)
  if (!countryNode) {
    return []
  }

  return [...(countryNode.states.find((item) => item.state === state)?.cities ?? [])]
}
