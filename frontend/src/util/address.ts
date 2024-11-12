export function constructAddress(
  postalCode: string,
  block?: string,
  streetName?: string,
  buildingName?: string,
  unitNo?: string,
) {
  const blockPart = block ? `${block} ` : "";
  const streetNamePart = streetName ? `${streetName}` : "";
  const buildingPart = buildingName ? `, ${buildingName}` : "";
  const unitNoPart = unitNo ? `, ${unitNo}` : "";
  const postalCodePart = postalCode ? `, ${postalCode}` : "";

  return `${blockPart}${streetNamePart}${buildingPart}${unitNoPart}${postalCodePart}`;
}
