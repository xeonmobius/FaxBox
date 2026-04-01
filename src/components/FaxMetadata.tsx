import { Separator } from "@/components/ui/separator"

interface FaxMetadataProps {
  sender: string
  organization: string
  address: string
  faxNumber: string
  faxDate: string
}

export function FaxMetadata({ sender, organization, address, faxNumber, faxDate }: FaxMetadataProps) {
  return (
    <div className="w-80 border-l bg-card p-6 overflow-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Sender Information</h3>
          <div className="space-y-1">
            <p className="font-medium">{sender}</p>
            <p className="text-sm">{organization}</p>
            <p className="text-sm text-muted-foreground">{address}</p>
            <p className="text-sm">Fax: {faxNumber}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Fax Date</h3>
          <p className="text-sm">{faxDate}</p>
        </div>
      </div>
    </div>
  )
}
