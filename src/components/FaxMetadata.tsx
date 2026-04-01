interface FaxMetadataProps {
  sender: string
  organization: string
  faxNumber: string
  faxDate: string
}

export function FaxMetadata({ sender, organization, faxNumber, faxDate }: FaxMetadataProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b bg-muted/30 text-sm overflow-x-auto">
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-muted-foreground">From:</span>
        <span className="font-medium">{sender}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-muted-foreground">Org:</span>
        <span>{organization}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-muted-foreground">Fax:</span>
        <span>{faxNumber}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-muted-foreground">Date:</span>
        <span>{faxDate}</span>
      </div>
    </div>
  )
}
