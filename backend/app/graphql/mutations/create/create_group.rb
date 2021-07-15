module Mutations
	class Create::CreateGroup < GraphQL::Schema::Mutation
		graphql_name "CreateGroup"

		argument :attributes, Types::Input::GroupInputType, required: true

		field :group, Types::GroupType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			group = Group.new(name: attributes.name)
			group.members << Member.new(accepted: true, user: context[:current_user])

			if group.save!
				{
					group: group,
					errors: nil,
				}
			else
				{
					group: nil,
					errors: group.errors.full_messages,
				}
			end
		end
	end
end