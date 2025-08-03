---
applyTo: "**"
---

# Create a customer

> Create an unverified customer, verified customer, or receive-only user.

## OpenAPI

````yaml post /customers
paths:
  path: /customers
  method: post
  servers:
    - url: https://api.dwolla.com
      description: Production server
    - url: https://api-sandbox.dwolla.com
      description: Sandbox server
  request:
    security:
      - title: clientCredentials
        parameters:
          query: {}
          header:
            Authorization:
              type: oauth2
          cookie: {}
    parameters:
      path: {}
      query: {}
      header:
        Accept:
          schema:
            - type: enum<string>
              enum:
                - application/vnd.dwolla.v1.hal+json
              required: true
              description: >-
                The media type of the response. Must be
                application/vnd.dwolla.v1.hal+json
              default: application/vnd.dwolla.v1.hal+json
      cookie: {}
    body:
      application/vnd.dwolla.v1.hal+json:
        schemaArray:
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: Account
              lastName:
                allOf:
                  - type: string
                    example: Admin
              email:
                allOf:
                  - type: string
                    example: accountAdmin@email.com
              type:
                allOf:
                  - type: string
                    const: receive-only
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              businessName:
                allOf:
                  - type: string
                    example: Jane Corp llc
            required: true
            title: CreateReceiveOnlyUser
            description: Create a Receive Only User
            refIdentifier: '#/components/schemas/CreateReceiveOnlyUser'
            requiredProperties:
              - firstName
              - lastName
              - email
              - type
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: Account
              lastName:
                allOf:
                  - type: string
                    example: Admin
              email:
                allOf:
                  - type: string
                    example: accountAdmin@email.com
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              businessName:
                allOf:
                  - type: string
                    example: Jane Corp llc
            required: true
            title: CreateUnverifiedCustomer
            description: Create an Unverified Customer
            refIdentifier: '#/components/schemas/CreateUnverifiedCustomer'
            requiredProperties:
              - firstName
              - lastName
              - email
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: Account
              lastName:
                allOf:
                  - type: string
                    example: Admin
              email:
                allOf:
                  - type: string
                    example: accountAdmin@email.com
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              type:
                allOf:
                  - type: string
                    const: personal
              address1:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              address2:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              city:
                allOf:
                  - type: string
                    example: Some City
              state:
                allOf:
                  - type: string
                    example: NY
              postalCode:
                allOf:
                  - type: string
                    example: 11101
              ssn:
                allOf:
                  - type: string
                    example: 1234
              dateOfBirth:
                allOf:
                  - type: string
                    example: '1980-09-12'
            required: true
            title: CreateVerifiedPersonalCustomer
            description: Create a Verified Personal customer
            refIdentifier: '#/components/schemas/CreateVerifiedPersonalCustomer'
            requiredProperties:
              - firstName
              - lastName
              - email
              - address1
              - city
              - state
              - postalCode
              - dateOfBirth
              - type
              - ssn
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: John
              lastName:
                allOf:
                  - type: string
                    example: Doe
              email:
                allOf:
                  - type: string
                    example: johndoe@email.com
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              type:
                allOf:
                  - type: string
                    const: business
              address1:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              address2:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              city:
                allOf:
                  - type: string
                    example: Some City
              state:
                allOf:
                  - type: string
                    example: NY
              postalCode:
                allOf:
                  - type: string
                    example: 11101
              ssn:
                allOf:
                  - type: string
                    example: 1234
              dateOfBirth:
                allOf:
                  - type: string
                    example: '1980-09-12'
              businessClassification:
                allOf:
                  - type: string
                    example: 9ed3f670-7d6f-11e3-b1ce-5404a6144203
              businessName:
                allOf:
                  - type: string
                    example: Jane Corp
              doingBusinessAs:
                allOf:
                  - type: string
                    example: Jane's Electronics
              ein:
                allOf:
                  - type: string
                    example: 00-0000000
              website:
                allOf:
                  - type: string
                    example: https://www.domain.com
              businessType:
                allOf:
                  - type: string
                    const: soleProprietorship
            required: true
            title: CreateVerifiedSolePropCustomer
            description: Create a Verified Business customer (Sole Proprietorship)
            refIdentifier: '#/components/schemas/CreateVerifiedSolePropCustomer'
            requiredProperties:
              - firstName
              - lastName
              - email
              - address1
              - city
              - state
              - postalCode
              - dateOfBirth
              - type
              - ssn
              - businessType
              - businessName
              - businessClassification
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: Jane
              lastName:
                allOf:
                  - type: string
                    example: Business
              email:
                allOf:
                  - type: string
                    example: jane.business@email.com
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              type:
                allOf:
                  - type: string
                    const: business
              address1:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              address2:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              city:
                allOf:
                  - type: string
                    example: Some City
              state:
                allOf:
                  - type: string
                    example: NY
              postalCode:
                allOf:
                  - type: string
                    example: 11101
              businessClassification:
                allOf:
                  - type: string
                    example: 9ed3f670-7d6f-11e3-b1ce-5404a6144203
              businessName:
                allOf:
                  - type: string
                    example: Jane Corp
              doingBusinessAs:
                allOf:
                  - type: string
                    example: Jane's Electronics
              ein:
                allOf:
                  - type: string
                    example: 00-0000000
              website:
                allOf:
                  - type: string
                    example: https://www.domain.com
              controller:
                allOf:
                  - type: object
                    required:
                      - firstName
                      - lastName
                      - title
                      - dateOfBirth
                      - address
                      - ssn
                    properties:
                      firstName:
                        type: string
                        example: John
                      lastName:
                        type: string
                        example: Controller
                      title:
                        type: string
                        example: CEO
                      dateOfBirth:
                        type: string
                        example: '1980-01-31'
                      address:
                        $ref: '#/components/schemas/InternationalAddress'
                      ssn:
                        type: string
                        example: '1234'
              businessType:
                allOf:
                  - type: string
                    enum:
                      - llc
                      - corporation
                      - partnership
                    example: llc
            required: true
            title: CreateVerifiedBusinessCustomerWithController
            description: Create a Verified Business customer with a US controller
            refIdentifier: '#/components/schemas/CreateVerifiedBusinessCustomerWithController'
            requiredProperties:
              - firstName
              - lastName
              - email
              - address1
              - city
              - state
              - postalCode
              - type
              - businessType
              - controller
              - businessName
              - businessClassification
              - ein
          - type: object
            properties:
              firstName:
                allOf:
                  - type: string
                    example: Jane
              lastName:
                allOf:
                  - type: string
                    example: Business
              email:
                allOf:
                  - type: string
                    example: jane.business@email.com
              ipAddress:
                allOf:
                  - type: string
                    example: 143.156.7.8
              phone:
                allOf:
                  - type: string
                    example: 5555555555
              correlationId:
                allOf:
                  - type: string
                    example: fc451a7a-ae30-4404-aB95-e3553fcd733
              type:
                allOf:
                  - type: string
                    const: business
              address1:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              address2:
                allOf:
                  - type: string
                    example: 99-99 33rd St
              city:
                allOf:
                  - type: string
                    example: Some City
              state:
                allOf:
                  - type: string
                    example: NY
              postalCode:
                allOf:
                  - type: string
                    example: 11101
              businessClassification:
                allOf:
                  - type: string
                    example: 9ed3f670-7d6f-11e3-b1ce-5404a6144203
              businessName:
                allOf:
                  - type: string
                    example: Jane Corp
              doingBusinessAs:
                allOf:
                  - type: string
                    example: Jane's Electronics
              ein:
                allOf:
                  - type: string
                    example: 00-0000000
              website:
                allOf:
                  - type: string
                    example: https://www.domain.com
              controller:
                allOf:
                  - type: object
                    required:
                      - firstName
                      - lastName
                      - title
                      - dateOfBirth
                      - address
                      - passport
                    properties:
                      firstName:
                        type: string
                        example: John
                      lastName:
                        type: string
                        example: Controller
                      title:
                        type: string
                        example: CEO
                      dateOfBirth:
                        type: string
                        example: '1980-01-31'
                      address:
                        $ref: '#/components/schemas/InternationalAddress'
                      passport:
                        $ref: '#/components/schemas/Passport'
              businessType:
                allOf:
                  - type: string
                    enum:
                      - llc
                      - corporation
                      - partnership
                    example: llc
            required: true
            title: CreateVerifiedBusinessCustomerWithInternationalController
            description: >-
              Create a Verified Business customer with an international (non US)
              controller
            refIdentifier: >-
              #/components/schemas/CreateVerifiedBusinessCustomerWithInternationalController
            requiredProperties:
              - firstName
              - lastName
              - email
              - address1
              - city
              - state
              - postalCode
              - type
              - businessType
              - controller
              - businessName
              - businessClassification
              - ein
        examples:
          example:
            value:
              firstName: Account
              lastName: Admin
              email: accountAdmin@email.com
              type: <string>
              ipAddress: 143.156.7.8
              phone: 5555555555
              correlationId: fc451a7a-ae30-4404-aB95-e3553fcd733
              businessName: Jane Corp llc
        description: Parameters for customer to be created
  response:
    '201':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: successful operation
        examples: {}
        description: successful operation
    '400':
      application/vnd.dwolla.v1.hal+json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: string
                    example: BadRequest
              message:
                allOf:
                  - type: string
                    example: The request body contains bad syntax or is incomplete.
            title: BadRequestError
            description: Error response schema for 400 Bad Request
            refIdentifier: '#/components/schemas/BadRequestError'
            requiredProperties:
              - code
              - message
        examples:
          example:
            value:
              code: BadRequest
              message: The request body contains bad syntax or is incomplete.
        description: Bad Request
    '403':
      application/vnd.dwolla.v1.hal+json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: string
                    example: forbidden
              message:
                allOf:
                  - type: string
                    example: Not authorized to create customers.
        examples:
          example:
            value:
              code: forbidden
              message: Not authorized to create customers.
        description: forbidden
    '404':
      application/vnd.dwolla.v1.hal+json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: string
                    example: notFound
              message:
                allOf:
                  - type: string
                    example: not found.
        examples:
          example:
            value:
              code: notFound
              message: not found.
        description: not found
  deprecated: false
  type: path
components:
  schemas:
    InternationalAddress:
      title: InternationalAddress
      type: object
      required:
        - address1
        - city
        - country
        - stateProvinceRegion
      properties:
        address1:
          type: string
          example: 462 Main Street
        address2:
          type: string
          example: Suite 123
        address3:
          type: string
          example: Unit 123
        city:
          type: string
          example: Des Moines
        postalCode:
          type: string
          example: '50309'
        country:
          type: string
          example: USA
        stateProvinceRegion:
          type: string
          example: IA
    Passport:
      title: Passport
      type: object
      required:
        - number
        - country
      properties:
        number:
          type: string
        country:
          type: string

````