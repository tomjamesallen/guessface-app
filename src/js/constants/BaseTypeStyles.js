import SizingVars from './SizingVars'
import u from '../helpers/unit'
import Colors from './ThemeColors'

export default {
  h1: {
    fontSize: u(SizingVars.type.h1)
  },
  h2: {
    fontSize: u(SizingVars.type.h2),
    lineHeight: u(SizingVars.type.h2),
    marginBottom: 0
  },
  h3: {
    fontSize: u(SizingVars.type.h3),
    marginBottom: u(SizingVars.type.p * 1.5),
    fontWeight: 200
  },
  p: {
    fontSize: u(SizingVars.type.p),
    lineHeight: u(SizingVars.type.p * 1.5),
    marginBottom: u(SizingVars.type.p * 1.5),
    fontWeight: 200
  },
  ul: {
    fontSize: u(SizingVars.type.p),
    lineHeight: u(SizingVars.type.p * 1.5),
    marginBottom: u(SizingVars.type.p * 1.5),
    listStyleType: 'none'
  },
  li: {
    fontSize: u(SizingVars.type.p),
    lineHeight: u(SizingVars.type.p * 1.5),
    fontWeight: 200
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
    borderBottom: `2px solid ${Colors.secondary}`
  },
  light: {
    fontWeight: 200
  },
  noMarginBottom: {
    marginBottom: 0
  }
}
