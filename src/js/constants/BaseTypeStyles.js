import SizingVars from './SizingVars'
import { Rem } from '../helpers/units'
const rem = Rem()

export default {
  h1: {
    fontSize: rem(SizingVars.type.h1)
  },
  h2: {
    fontSize: rem(SizingVars.type.h2),
    lineHeight: rem(SizingVars.type.h2),
    marginBottom: 0
  },
  h3: {
    fontSize: rem(SizingVars.type.h3),
    marginBottom: rem(SizingVars.type.p * 1.5)
  },
  p: {
    fontSize: rem(SizingVars.type.p),
    lineHeight: rem(SizingVars.type.p * 1.5),
    marginBottom: rem(SizingVars.type.p * 1.5)
  },
  ul: {
    fontSize: rem(SizingVars.type.p),
    lineHeight: rem(SizingVars.type.p * 1.5),
    marginBottom: rem(SizingVars.type.p * 1.5),
    listStyleType: 'none'
  },
  li: {
    fontSize: rem(SizingVars.type.p),
    lineHeight: rem(SizingVars.type.p * 1.5)
  },
  a: {
    color: 'inherit'
  }
}
